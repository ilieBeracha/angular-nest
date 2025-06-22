import { Injectable } from "@nestjs/common";
import { Builder, Browser, By, until, WebDriver } from "selenium-webdriver";

@Injectable()
export class ScraperService {
  private readonly baseUrl = "https://www.yad2.co.il/realestate/rent?";

  async scrapeData(params: any, maxPages = 3): Promise<any[]> {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    const results: any[] = [];

    try {
      const totalPages = await this.getTotalPages(driver, params, maxPages);
      console.log(`Scraping up to ${totalPages} pages...`);

      for (let page = 1; page <= totalPages; page++) {
        const url = this.urlBuilder(params, page);
        console.log(`\n🔎 Visiting page ${page}: ${url}`);

        await driver.get(url);
        await driver.sleep(3000);

        const pageResults = await this.extractListingsFromPage(driver);
        console.log(`📄 Found ${pageResults.length} listings on page ${page}`);
        results.push(...pageResults);
      }
    } catch (err) {
      console.error("❌ Scraper error:", err);
      throw err;
    } finally {
      await driver.quit();
    }

    console.log(`\n✅ Total listings scraped: ${results.length}`);
    const cleanedResults = this.cleanListings(results);
    return cleanedResults;
  }

  private async getTotalPages(
    driver: WebDriver,
    params: any,
    maxPages: number
  ): Promise<number> {
    const url = this.urlBuilder(params, 1);
    await driver.get(url);
    await driver.wait(
      until.elementLocated(By.css("ol.list_list__wI8f9")),
      10000
    );

    const pageLinks = await driver.findElements(
      By.css("ol.list_list__wI8f9 a[data-nagish='pagination-item-link']")
    );

    let maxFound = 1;
    for (const link of pageLinks) {
      const text = await link.getText();
      const num = parseInt(text, 10);
      if (!isNaN(num) && num > maxFound) maxFound = num;
    }

    console.log(`🧭 Detected ${maxFound} total pages`);
    return Math.min(maxFound, maxPages);
  }

  private async extractListingsFromPage(driver: WebDriver): Promise<any[]> {
    await driver.wait(
      until.elementLocated(
        By.css(
          "ul[data-testid='feed-list'][data-nagish='page-layout-feed-list']"
        )
      ),
      10000
    );

    const items = await driver.findElements(
      By.css("li[data-testid='item-basic']")
    );
    const results: any[] = [];

    for (const item of items) {
      const listing: any = {};

      try {
        listing.title = await item
          .findElement(By.css(".item-data-content_heading__tphH4"))
          .getText();
      } catch {}

      try {
        const spans = await item.findElements(
          By.css("h2 span.item-data-content_itemInfoLine__AeoPP")
        );
        listing.location = spans[0] ? await spans[0].getText() : null;
        listing.details = spans[1] ? await spans[1].getText() : null;
      } catch {}

      try {
        listing.price = await item
          .findElement(By.css("[data-testid='price']"))
          .getText();
      } catch {}

      try {
        const img = await item.findElement(By.css("img[data-testid='image']"));
        listing.imageUrl = await img.getAttribute("src");
      } catch {
        try {
          const skeleton = await item.findElement(
            By.css("div[data-testid='image-skeleton']")
          );
          const style = await skeleton.getAttribute("style");
          const match = style.match(/url\(([^)]+)\)/);
          listing.imageUrl = match ? match[1] : null;
        } catch {
          listing.imageUrl = null;
        }
      }

      try {
        const linkEl = await item.findElement(
          By.css("a[data-nagish='feed-item-layout-link']")
        );
        const href = await linkEl.getAttribute("href");
        listing.url = href;
      } catch {
        listing.url = null;
      }

      try {
        const tags = await item.findElements(
          By.css(".item-tags_itemTagsBox__Uz23E > span")
        );
        listing.tags = [];
        for (const tagEl of tags) {
          listing.tags.push(await tagEl.getText());
        }
      } catch {
        listing.tags = [];
      }

      results.push(listing);
    }

    return results;
  }

  private urlBuilder(params: any, page = 1): string {
    const {
      minPrice = 8000,
      maxPrice = 11000,
      minRooms = 3,
      property = 1,
      balcony = 1,
      topArea = 2,
      bBox = "32.056773%2C34.751108%2C32.084348%2C34.793108",
    } = params;

    const query = new URLSearchParams({
      minPrice: String(minPrice),
      maxPrice: String(maxPrice),
      minRooms: String(minRooms),
      property: String(property),
      balcony: String(balcony),
      topArea: String(topArea),
      bBox,
      city: "5000",
      page: String(page),
    });

    return `${this.baseUrl}${query.toString()}`;
  }

  private cleanListings(rawListings: any[]) {
    return rawListings.map((listing) => {
      const cleaned = { ...listing };

      // 🧼 Split location into street + city
      if (cleaned.location?.startsWith("דירה,")) {
        const parts = cleaned.location.replace("דירה, ", "").split(",");
        cleaned.street = parts[0]?.trim() || null;
        cleaned.city = parts[1]?.trim() || null;
      } else {
        cleaned.street = null;
        cleaned.city = null;
      }

      // 🧼 Extract numbers from details
      if (cleaned.details?.includes("•")) {
        const parts = cleaned.details.split("•").map((p) => p.trim());

        const getNumber = (str: string | null): number | null => {
          const match = str?.match(/\d+/);
          return match ? parseInt(match[0], 10) : null;
        };

        cleaned.rooms = getNumber(parts[0]);
        cleaned.floor = getNumber(parts[1]);
        cleaned.size = getNumber(parts[2]);
      } else {
        cleaned.rooms = null;
        cleaned.floor = null;
        cleaned.size = null;
      }

      delete cleaned.location;
      delete cleaned.details;
      return cleaned;
    });
  }

  private async scrapeMadlan(params: any, maxPages = 3): Promise<any[]> {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    const results: any[] = [];

    try {
      const madlanUrl =
        "https://www.madlan.co.il/for-rent/תל-אביב-יפו-ישראל?bbox=34.77841%2C32.02941%2C34.81583%2C32.14610&filters=_8000-11000_3-___flat_balcony_____0-10000______search-filter-top-bar";
      await driver.get(madlanUrl);
      await driver.sleep(5000);

      const items = await driver.findElements(
        By.css('[data-auto="listed-bulletin"]')
      );

      for (const item of items) {
        const listing: any = {};

        try {
          const addressEl = await item.findElement(
            By.css('[data-auto="property-address"]')
          );
          const locationText = await addressEl.getText();
          const locationParts = locationText.replace("דירה, ", "").split(",");
          listing.title =
            locationParts[1]?.trim() || locationParts[0]?.trim() || null;
          listing.street = locationParts[1]?.trim() || null;
          listing.city =
            locationParts[2]?.trim() || locationParts[1]?.trim() || null;
        } catch {
          listing.street = null;
          listing.city = null;
          listing.title = null;
        }

        try {
          listing.price = await item
            .findElement(By.css('[data-auto="property-price"]'))
            .getText();
        } catch {}

        try {
          const roomsText = await item
            .findElement(By.css('[data-auto="property-rooms"]'))
            .getText();
          const floorText = await item
            .findElement(By.css('[data-auto="property-floor"]'))
            .getText();
          const sizeText = await item
            .findElement(By.css('[data-auto="property-size"]'))
            .getText();

          const getNumber = (str: string): number | null => {
            const match = str.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
          };

          listing.rooms = getNumber(roomsText);
          listing.floor = getNumber(floorText);
          listing.size = getNumber(sizeText);
        } catch {
          listing.rooms = null;
          listing.floor = null;
          listing.size = null;
        }

        try {
          const img = await item.findElement(
            By.css('img[data-auto="universal-card-image"]')
          );
          listing.imageUrl = await img.getAttribute("src");
        } catch {
          listing.imageUrl = null;
        }

        try {
          const linkEl = await item.findElement(
            By.css('a[data-auto="listed-bulletin-clickable"]')
          );
          const href = await linkEl.getAttribute("href");
          listing.url = `https://www.madlan.co.il${href}`;
        } catch {
          listing.url = null;
        }

        listing.tags = []; // Madlan doesn't use the same tags structure

        results.push(listing);
      }
    } catch (err) {
      console.error("❌ Madlan scrape error:", err);
    } finally {
      await driver.quit();
    }

    return results;
  }
}

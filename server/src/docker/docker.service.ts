import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as fs from 'fs';

@Injectable()
export class DockerService {
  private readonly docker = new Docker({ socketPath: '/var/run/docker.sock' });
  private readonly logger = new Logger(DockerService.name);

  /**
   * Launch a Docker container for the given site using a mounted config.json
   * @param siteId - The unique site ID
   * @param port - The external port to expose the container on
   */
  async launchSiteContainer(siteId: string, port: number, pageId: string): Promise<void> {
    const containerName = `site-${siteId}`;
    const image = 'next-app';
    const internalPort = '3000';

    // Create /tmp/config-siteId.json file
    const configPath = `/tmp/config-${siteId}.json`;
    const configContent = {
      siteId,
      dockerApiURL: 'http://host.docker.internal:3000',
      pageId
    };
    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));

    try {
      this.logger.log(`Launching Docker container for site ${siteId} on port ${port}`);

      // Remove existing container with the same name
      const existing = await this.docker.listContainers({ all: true });
      const match = existing.find(c => c.Names.includes(`/${containerName}`));
      if (match) {
        this.logger.warn(`Removing existing container ${containerName}`);
        const old = this.docker.getContainer(match.Id);
        await old.remove({ force: true });
      }

      const container = await this.docker.createContainer({
        Image: image,
        name: containerName,
        Env: [],
        ExposedPorts: {
          [`${internalPort}/tcp`]: {},
        },
        HostConfig: {
          PortBindings: {
            [`${internalPort}/tcp`]: [{ HostPort: port.toString() }],
          },
          Binds: [`${configPath}:/app/public/config.json`],
        },
      });

      await container.start();
      this.logger.log(`Started container: ${containerName}`);
    } catch (err) {
      this.logger.error(`Failed to launch container for site ${siteId}: ${err.message}`);
      throw err;
    }
  }
}
















// import { Injectable, Logger } from '@nestjs/common';
// import * as Docker from 'dockerode';
// import * as fs from 'fs';

// @Injectable()
// export class DockerService {
//   private readonly docker = new Docker({ socketPath: '/var/run/docker.sock' });
//   private readonly logger = new Logger(DockerService.name);

//   /**
//    * Launch a Docker container for the given site using a mounted config.json
//    * @param siteId - The unique site ID
//    * @param port - The external port to expose the container on
//    */
//   async launchSiteContainer(siteId: string, port: number, pageId: string): Promise<void> {
//     const containerName = `site-${siteId}`;
//     const image = 'next-app';
//     const internalPort = '3000';

//     // Create /tmp/config-siteId.json file
//     const configPath = `/tmp/config-${siteId}.json`;
//     const configContent = {
//       siteId,
//       dockerApiURL: 'http://host.docker.internal:3000',
//       pageId
//     };
//     fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));

//     try {
//       this.logger.log(`Launching Docker container for site ${siteId} on port ${port}`);

//       // Remove existing container with the same name
//       const existing = await this.docker.listContainers({ all: true });
//       const match = existing.find(c => c.Names.includes(`/${containerName}`));
//       if (match) {
//         this.logger.warn(`Removing existing container ${containerName}`);
//         const old = this.docker.getContainer(match.Id);
//         await old.remove({ force: true });
//       }

//       const container = await this.docker.createContainer({
//         Image: image,
//         name: containerName,
//         Env: [],
//         ExposedPorts: {
//           [`${internalPort}/tcp`]: {},
//         },
//         HostConfig: {
//           PortBindings: {
//             [`${internalPort}/tcp`]: [{ HostPort: port.toString() }],
//           },
//           Binds: [`${configPath}:/app/public/config.json`],
//         },
//       });

//       await container.start();
//       this.logger.log(`Started container: ${containerName}`);
//     } catch (err) {
//       this.logger.error(`Failed to launch container for site ${siteId}: ${err.message}`);
//       throw err;
//     }
//   }
// }

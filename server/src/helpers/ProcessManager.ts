import { spawn, ChildProcess } from 'child_process';
import * as net from 'net';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

export class ProcessManager {
  private runningProcesses: Map<number, ChildProcess> = new Map();
  private restartCounts: Map<number, number> = new Map();
  private readonly MAX_RESTARTS = 5;

  private async isPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.listen(port, () => {
        server.once('close', () => resolve(false));
        server.close();
      });

      server.on('error', () => resolve(true));
    });
  }

  private async waitForPort(port: number, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await this.isPortInUse(port)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return false;
  }

  private killProcessOnPort(port: number): void {
    const existingProcess = this.runningProcesses.get(port);
    if (existingProcess && !existingProcess.killed) {
      console.log(`Killing existing process on port ${port}`);
      existingProcess.kill('SIGTERM');
      this.runningProcesses.delete(port);
    }
  }

  public async runLocally(siteId: string, port: number, pageId: string): Promise<void> {
    const configService = new ConfigService();
    const siteDir = configService.get('NEXT_TEMPLATE_DIR');
    
    if (!fs.existsSync(siteDir)) {
      console.error(`Site directory does not exist: ${siteDir}`);
      return;
    }

    if (this.runningProcesses.has(port)) {
      console.log(`Restarting process on port ${port} with new page ID: ${pageId}.`);
      this.killProcessOnPort(port);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (await this.isPortInUse(port)) {
      console.error(`Port ${port} is occupied by an unmanaged process. Please stop it manually and try again.`);
      return;
    }
    
    this.restartCounts.set(port, 0);

    const env = {
      ...process.env,
      PORT: port.toString(),
      SITE_ID: siteId,
      NEXT_PUBLIC_SITE_ID: siteId,
      NEXT_PUBLIC_PAGE_ID: pageId,
      NEXT_PUBLIC_PREVIEW: 'true'
    };

    console.log(`Starting Next.js dev server on port ${port}...`);

    const child = spawn('npm', ['run', 'dev', '--', '-p', port.toString()], {
      cwd: siteDir,
      env: env
    });

    this.runningProcesses.set(port, child);

    child.stdout?.on('data', (data) => {
      console.log(`[Port ${port}] ${data.toString().trim()}`);
    });

    child.stderr?.on('data', (data) => {
      console.error(`[Port ${port}] ERROR: ${data.toString().trim()}`);
    });

    child.on('exit', (code, signal) => {
      console.log(`[Port ${port}] Process exited with code ${code}, signal ${signal}`);
      this.runningProcesses.delete(port);
      
      if (signal !== 'SIGTERM' && code !== 0) {
        const restartCount = this.restartCounts.get(port) || 0;
        
        if (restartCount < this.MAX_RESTARTS) {
          this.restartCounts.set(port, restartCount + 1);
          console.log(`[Port ${port}] Process crashed. Attempting to restart in 3 seconds... (Attempt ${restartCount + 1}/${this.MAX_RESTARTS})`);
          setTimeout(() => {
            this.runLocally(siteId, port, pageId);
          }, 3000);
        } else {
          console.error(`[Port ${port}] Process crashed too many times. Not restarting again.`);
          this.restartCounts.delete(port);
        }
      } else {
        this.restartCounts.delete(port);
      }
    });

    child.on('error', (error) => {
      console.error(`[Port ${port}] Failed to start process:`, error);
      this.runningProcesses.delete(port);
    });

    const serverStarted = await this.waitForPort(port);
    if (serverStarted) {
      console.log(`✅ Next.js dev server successfully started on port ${port}`);
    } else {
      console.error(`❌ Failed to start server on port ${port} within timeout`);
    }
  }

  public stopProcess(port: number): void {
    this.killProcessOnPort(port);
  }

  public stopAllProcesses(): void {
    for (const [port, process] of this.runningProcesses.entries()) {
      console.log(`Stopping process on port ${port}`);
      process.kill('SIGTERM');
    }
    this.runningProcesses.clear();
  }

  public getRunningProcesses(): number[] {
    return Array.from(this.runningProcesses.keys());
  }
}



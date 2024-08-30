import { cpSync, mkdirSync, readdirSync, renameSync, rmSync, existsSync } from "fs";
import { spawn } from "node:child_process";

const syncContentFromGit = async (contentDir) => {
    try {
      if (!process.env.GIT_URL) {
        console.log('No GIT_URL found in environment variables, skipping content sync')
        return
      }
      const gitUrl = process.env.GIT_URL
      await runBashCommand(
        `git clone --depth 1 --single-branch ${gitUrl} ${contentDir + '/blog-tmp'}`
      )
      console.log('Synced content files from git successfully!')
      mkdirSync(contentDir + '/blog', { recursive: true })
      cpSync(contentDir + '/blog-tmp/blog-posts/', contentDir + '/blog', {
        recursive: true,
      })
      cpSync(contentDir + '/blog-tmp/static/images', process.cwd() + '/public/static/images', {
        recursive: true,
      })
      readdirSync(contentDir + '/blog', { recursive: true }).forEach((file) => {
        if (file.endsWith('.md')) {
          renameSync(
            contentDir + `/blog/${file}`,
            contentDir + `/blog/${file.replace('.md', '.mdx')}`
          )
        }
      })
      console.log('✅ Fetched content files from git successfully!')
    } finally {
      if (existsSync(contentDir + '/blog-tmp')){
        rmSync(contentDir + '/blog-tmp', { recursive: true })
      }
    }
}

const runBashCommand = (command) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, [], { shell: true })

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => process.stdout.write(data))

    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (data) => process.stderr.write(data))

    child.on('close', function (code) {
      if (code === 0) {
        resolve(void 0)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })

syncContentFromGit(process.cwd() + '/data')

pipeline {
    agent any
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18'
                    // Run the container on the node specified at the
                    // top-level of the Pipeline, in the same workspace,
                    // rather than on a new node entirely:
                    reuseNode true
                }
            }
            steps {
                sh '''
set -e

cd packages/gibney
yarn install && yarn start 

cd ../finder
yarn install && yarn build
mkdir -p dist && node dist-resolver/index.js > dist/universe.json

cd ../view
yarn slots

git add --all && git commit -m "automated scrape (gibney)" && git pull --rebase && git push -u origin main
                '''
            }
        }
    }
}
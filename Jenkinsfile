pipeline {
    agent any
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'cypress/included:12.13.0'
                }
            }
            steps {
                sh 'yarn install'
                dir('packages/gibney') {
                    withCredentials([usernamePassword(
                        credentialsId: 'gibney',
                        usernameVariable: 'CYPRESS_GIBNEY_USERNAME',
                        passwordVariable: 'CYPRESS_GIBNEY_PASSWORD')]) {
                        sh 'yarn install'
                        sh 'yarn start'
                    }
                }
                dir('packages/finder') {
                    sh 'yarn install'
                    sh 'yarn build'
                    sh 'mkdir -p dist && node dist-resolver/index.js > dist/universe.json'
                }
                dir('packages/view') {
                    sh 'yarn slots'
                }
                sh 'git add --all'
                sh 'git commit -m "automated scrape"'
                sh 'git push -u origin main'
            }
        }
    }
}

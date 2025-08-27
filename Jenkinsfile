pipeline {
    agent any

    environment {
        DOCKER_CMD = "/usr/local/bin/docker"  // chemin absolu pour macOS
    }

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/SB-y/CalculatriceJenkins'
            }
        }

        stage('Construire l\'image Docker') {
            steps {
                sh "${DOCKER_CMD} build --no-cache -t ${env.BUILD_ID} ."
            }
        }

        stage('Tester l\'application') {
            steps {
                sh "${DOCKER_CMD} run --rm ${env.BUILD_ID}"
            }
        }

        stage('Déploiement en production') {
            steps {
                script {
                    input message: 'Voulez-vous déployer en production ?', ok: 'Oui'
                    // Supprimer un ancien conteneur si existant
                    sh "${DOCKER_CMD} rm -f calculatrice-prod || true"
                    // Lancer l’application en prod
                    sh "${DOCKER_CMD} run -d --name calculatrice-prod -p 8081:8080 ${env.BUILD_ID} npx http-server -p 8080"
                    echo "L'application est maintenant accessible sur http://localhost:8081"
                }
            }
        }
    }
}

pipeline {
    agent any

    stages {
        stage('Verificar Repositório') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Dependências') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Fazer Deploy') {
            steps {
                withCredentials([string(credentialsId: 'infisical-token-dev', variable: 'INFISICAL_TOKEN')]) {
                    bat 'infisical run --env=dev --token="%INFISICAL_TOKEN%" -- docker compose up -d --no-build'
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy do Microserviço de Frota realizado com sucesso!'
        }
        failure {
            echo 'Houve um erro durante o deploy.'
        }
    }
}

pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        stage('Verificar Repositório') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Dependências') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Validar Docker Compose') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'infisical-token-dev',
                        variable: 'INFISICAL_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu

                        npx -y @infisical/cli run \
                            --projectId=cbcc8789-3cf2-440c-8e90-8dfff9872bff \
                            --env=dev \
                            --path=/ \
                            --token="$INFISICAL_TOKEN" \
                            -- docker compose config --quiet
                    '''
                }
            }
        }

        stage('Construir Imagem Docker') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'infisical-token-dev',
                        variable: 'INFISICAL_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu

                        npx -y @infisical/cli run \
                            --projectId=cbcc8789-3cf2-440c-8e90-8dfff9872bff \
                            --env=dev \
                            --path=/ \
                            --token="$INFISICAL_TOKEN" \
                            -- docker compose build
                    '''
                }
            }
        }

        stage('Fazer Deploy') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'infisical-token-dev',
                        variable: 'INFISICAL_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        set -eu

                        npx -y @infisical/cli run \
                            --projectId=cbcc8789-3cf2-440c-8e90-8dfff9872bff \
                            --env=dev \
                            --path=/ \
                            --token="$INFISICAL_TOKEN" \
                            -- docker compose up -d --no-build --force-recreate
                    '''
                }
            }
        }

        stage('Verificar Container') {
            steps {
                sh '''
                    set -eu

                    sleep 10

                    RUNNING=$(docker inspect \
                        --format '{{.State.Running}}' \
                        microservico-frota)

                    if [ "$RUNNING" != "true" ]; then
                        echo "ERRO: Container não está rodando."
                        exit 1
                    fi

                    echo "Container em execução."
                '''
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

{ pkgs, ... }: {
  # Qual canal nixpkgs usar
  channel = "stable-24.11";
  # Pacotes que você quer ter no ambiente
  packages = [
    pkgs.nodejs_20
  ];
  # Variáveis de ambiente do workspace
  env = {};

  idx = {
    extensions = [
      "angular.ng-template"
    ];

    workspace = {
      # Roda só na primeira vez que esse dev.nix for usado
      onCreate = {
        # instala dentro de frontend
        "npm-install" = "cd frontend && npm ci --no-audit --prefer-offline --no-progress --timing || npm i --no-audit --no-progress --timing";
        # arquivos pra abrir por padrão
        default.openFiles = [ "frontend/src/app/app.component.ts" ];
      };
      # Roda toda vez que o workspace for iniciado
      onStart = {
        # sobe o frontend já com o cd certo
        "serve-frontend" = "cd frontend && npm run start -- --host 0.0.0.0 --port $PORT";
        # se quiser também rodar os testes automaticamente
        "test-frontend"  = "cd frontend && npm run test -- --watch=false";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          # esse comando será usado pelo VS Code Web Preview
          command = [ "npm" "run" "start" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
          manager = "web";
          # garante que vai rodar na pasta certa
          cwd = "frontend";
        };
      };
    };
  };
}

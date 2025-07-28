import QB from "@/lib/quickblox";
import { initQuickBlox } from "@/lib/quickblox";

type QBUser = {
  id: number;
  full_name: string;
  email?: string;
  [key: string]: any;
};

let isQBInitialized = false;

export async function registerQuickBloxUser({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}): Promise<QBUser> {
  if (!isQBInitialized) {
    console.log("[QuickBlox] Inicializando QuickBlox...");
    initQuickBlox();
    isQBInitialized = true;
  }

  return new Promise((resolve, reject) => {
    console.log("[QuickBlox] Criando sessão de aplicação...");

    QB.createSession((sessionErr: any, sessionRes: any) => {
      if (sessionErr) {
        console.error("[QuickBlox] Erro ao criar sessão:", sessionErr);
        return reject(sessionErr);
      }

      console.log("[QuickBlox] Sessão criada com sucesso:", sessionRes);

      const userPayload = {
        login: email,
        password,
        email,
        full_name: fullName,
        custom_data: JSON.stringify({ age_over16: true }),
        age_over16: true,
      };

      console.log(`[QuickBlox] Tentando criar usuário: ${email}`);

      QB.users.create(userPayload, (createErr: any, createRes: any) => {
        if (createErr) {
          if (
            createErr.code === 422
          ) {
            console.warn("[QuickBlox] Usuário já existe. Tentando login...");

            // Tenta login com esse usuário
            QB.login({ login: email, password }, (loginErr: any, loginRes: any) => {
              if (loginErr) {
                console.error("[QuickBlox] Erro ao fazer login:", loginErr);
                return reject(loginErr);
              }

              console.log("[QuickBlox] Login com usuário existente bem-sucedido:", loginRes);
              return resolve(loginRes);
            });
          } else {
            console.error("[QuickBlox] Erro ao criar usuário:", createErr);
            return reject(createErr);
          }
        } else {
          console.log("[QuickBlox] Usuário criado com sucesso:", createRes);
          return resolve(createRes);
        }
      });
    });
  });
}


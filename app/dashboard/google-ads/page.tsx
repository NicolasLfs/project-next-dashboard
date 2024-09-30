// components/ConnectGoogleAds.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { googleLogout } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { oauth2Client } from "@/utils/googleadsapi";
import { google } from "googleapis";

const ConnectGoogleAds: React.FC = () => {
  const { data: session } = useSession();
  const [isGoogleAdsConnected, setIsGoogleAdsConnected] = useState(false);

  // 1. Configurar o Cliente OAuth 2.0 (substitua pelos seus dados reais)
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = "http://localhost:3000/profile";

  const router = useRouter();

  const handleConnectGoogleAds = async () => {
    try {
      // 2. Redirecionar o Usuário para o Google para Autenticação
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set(
        "scope",
        "https://www.googleapis.com/auth/adwords"
      );

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Erro ao conectar ao Google Ads:", error);
    }
  };

  // Função para lidar com o código de autorização
  // (chamada após o redirecionamento do Google)
  const handleAuthorizationCode = async (code: string) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);

      // Armazenar o token de acesso (localStorage, cookies, etc.)
      if (tokens.access_token) {
        localStorage.setItem("googleAdsAccessToken", tokens.access_token);
      } else {
        console.error("Token de acesso não encontrado.");
        return;
      }

      setIsGoogleAdsConnected(true);

      // Criar o cliente da API do Google Ads (sem a necessidade de keyFilename)
      const adsClient =
        await google.ads.googleads.v14.services.GoogleAdsServiceClient.create({
          credentials: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: tokens.refresh_token, // Certifique-se de que você também está armazenando o refresh_token
          },
        });

      // Criar a solicitação de pesquisa
      const request =
        new google.ads.googleads.v14.services.SearchGoogleAdsRequest({
          customerId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID,
          query: "SELECT campaign.id, campaign.name FROM campaign",
        });

      try {
        const [response] = await adsClient.search(request);

        // Iterar sobre as campanhas
        for (const row of response.results) {
          const campaign = row.campaign;
          if (campaign) {
            console.log(`Nome da Campanha: ${campaign.name}`);
            console.log(`ID da Campanha: ${campaign.id}`);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
      }

      // Redirecionar para evitar o processamento repetido do código
      router.push("/profile"); // Ou outra rota
    } catch (error) {
      console.error("Erro ao obter tokens de acesso:", error);
    }
  };

  // Efeito para verificar se há um código de autorização na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleAuthorizationCode(code);
    }
  }, []);

  const handleDisconnectGoogleAds = () => {
    // 3. Revogar o Token de Acesso (se necessário)
    // Implemente a lógica para revogar o token de acesso do Google Ads aqui.

    // Atualizar o estado para desconectado
    setIsGoogleAdsConnected(false);

    // Deslogar da conta Google (opcional)
    googleLogout();
  };

  return (
    <div>
      {isGoogleAdsConnected ? (
        // Botão para Desconectar
        <button onClick={handleDisconnectGoogleAds}>
          Desconectar do Google Ads
        </button>
      ) : (
        // Botão para Conectar
        <button onClick={handleConnectGoogleAds}>Conectar ao Google Ads</button>
      )}
    </div>
  );
};

export default ConnectGoogleAds;

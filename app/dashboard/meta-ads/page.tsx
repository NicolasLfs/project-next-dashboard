"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/app/ui/button";

// Função para buscar contas de anúncios
async function fetchAdAccounts(accessToken: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v16.0/me/adaccounts?access_token=${accessToken}`
    );
    return response.data.data;
  } catch {
    return [];
  }
}

// Função para buscar campanhas e insights de uma conta de anúncios específica
async function fetchCampaigns(
  adAccountId: string,
  accessToken: string
): Promise<any[]> {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v16.0/${adAccountId}/campaigns?access_token=${accessToken}&fields=name,status,objective`
    );
    const campaigns = response.data.data;

    // Para cada campanha, buscar os insights (impressões, cliques, gastos)
    const campaignsWithInsights = await Promise.all(
      campaigns.map(async (campaign: any) => {
        const insightsResponse = await axios.get(
          `https://graph.facebook.com/v16.0/${campaign.id}/insights?access_token=${accessToken}&fields=impressions,clicks,spend`
        );
        const insights = insightsResponse.data.data[0] || {}; // Caso não haja insights, retorna objeto vazio
        return {
          ...campaign,
          insights, // Anexa os insights à campanha
        };
      })
    );

    return campaignsWithInsights;
  } catch {
    return [];
  }
}

export default function MetaPage() {
  const [adAccounts, setAdAccounts] = useState<any[]>([]); // Contas de anúncios
  const [loading, setLoading] = useState(true); // Indicador de carregamento
  const [accessToken, setAccessToken] = useState<string | null>(null); // Token de acesso
  const [loggedIn, setLoggedIn] = useState(false); // Verifica se o usuário está logado
  const [selectedAdAccount, setSelectedAdAccount] = useState<any>(null); // Conta de anúncio selecionada
  const [campaigns, setCampaigns] = useState<any[]>([]); // Campanhas da conta selecionada
  const [showAccounts, setShowAccounts] = useState(true); // Controla se as contas de anúncios estão visíveis
  const [adAccountName, setAdAccountName] = useState<string>(""); // Nome da conta de anúncios

  // Verifica se o token está no localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("fbAccessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      setLoggedIn(true); // Usuário está logado
    } else {
      setLoggedIn(false); // Usuário não está logado
    }
    setLoading(false);
  }, []);

  // Busca as contas de anúncios assim que o token estiver disponível
  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      fetchAdAccounts(accessToken).then((adAccountsData) => {
        setAdAccounts(adAccountsData);
        setLoading(false);
      });
    }
  }, [accessToken]);

  // Função para acessar uma conta de anúncios e buscar campanhas
  const handleAdAccountClick = (adAccountId: string, adAccountName: string) => {
    if (accessToken) {
      setLoading(true);
      setSelectedAdAccount(adAccountId);
      setAdAccountName(adAccountName); // Define o nome da conta de anúncios
      setShowAccounts(false); // Esconde a lista de contas de anúncios
      fetchCampaigns(adAccountId, accessToken).then((campaignsData) => {
        setCampaigns(campaignsData);
        setLoading(false);
      });
    }
  };

  // Função para voltar à lista de contas de anúncios
  const handleBackToAccounts = () => {
    setSelectedAdAccount(null);
    setCampaigns([]);
    setShowAccounts(true); // Exibe a lista de contas de anúncios novamente
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("fbAccessToken");
    setAccessToken(null);
    setLoggedIn(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-medium">
          Meta Ads
          {/* Indicador de login ao lado do título */}
          <span
            className={`inline-block w-4 h-4 rounded-full ml-2 ${
              loggedIn ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        <div className="text-gray-600">
          Veja suas contas de anúncios e campanhas
        </div>
      </div>
      <div className="w-full p-4">
        {loggedIn ? (
          <>
            {loading ? (
              <p className="text-center">Carregando contas de anúncios...</p>
            ) : adAccounts.length > 0 ? (
              <>
                {showAccounts && (
                  <>
                    <h2 className="text-xl font-bold mb-4">
                      Contas de anúncios:
                    </h2>
                    <ul className="list-disc ml-6">
                      {adAccounts.map((adAccount) => (
                        <li key={adAccount.id}>
                          <button
                            className="px-4 py-2 rounded-md text-zinc-950 font-medium hover:text-blue-400 focus:outline-none focus:ring-2"
                            onClick={() =>
                              handleAdAccountClick(adAccount.id, adAccount.name)
                            }
                          >
                            {adAccount.name ||
                              `Conta de Anúncios ${adAccount.id}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedAdAccount && campaigns.length > 0 && (
                  <div className="inline-block w-full">
                    <div className="mt-6">
                      <h3 className="text-lg font-bold mb-4">
                        Campanhas da Conta {adAccountName}:
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {campaigns
                          .filter((campaign) => campaign.status === "ACTIVE")
                          .map((campaign) => (
                            <div
                              key={campaign.id}
                              className="bg-gray-100 rounded-md shadow-sm"
                            >
                              <div className="px-4 py-3">
                                <div className="text-gray-800 font-medium">
                                  {campaign.name}
                                </div>
                                <div className="text-gray-600">
                                  Status: {campaign.status}
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="mb-2">
                                  Objetivo: {campaign.objective}
                                </p>

                                {campaign.insights ? (
                                  <>
                                    <p className="mb-2">
                                      Alcance: {campaign.insights.reach || 0}
                                    </p>
                                    <p className="mb-2">
                                      Impressões:{" "}
                                      {campaign.insights.impressions || 0}
                                    </p>
                                    {/* ... Outros insights */}
                                  </>
                                ) : (
                                  <p>Sem dados disponíveis para insights</p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="px-4 py-2 rounded-md bg-green-500 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 float-left"
                        onClick={handleBackToAccounts}
                      >
                        Voltar às contas de anúncios
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex w-full justify-end relative">
                  <Button
                    className="absolute bottom-0 px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 float-right"
                    onClick={logout}
                  >
                    Deslogar
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center">
                Nenhuma conta de anúncios encontrada.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-center">
              Usuário não está logado.{" "}
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => loginWithFacebook()}
              >
                Logar com Facebook
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Função para redirecionar o usuário ao Facebook OAuth
function loginWithFacebook() {
  const fbAppId = process.env.AUTH_FACEBOOK_ID; // Substitua pelo seu App ID do Facebook
  const redirectUri = "https://dataris.com.br/meta/callback"; // URL de callback configurada no seu app do Facebook
  const fbOAuthUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=ads_read,ads_management`;

  // Redireciona o usuário para o Facebook para autenticação
  window.location.href = fbOAuthUrl;
}

# Análise e Propostas: IA Sônia (AuraChat)

Após analisar a implementação atual da aba **IA Sônia** no AuraChat, identifiquei que o sistema já possui uma estrutura sólida de configuração (Identidade, Tom de Voz, Regras e Configurações Avançadas). No entanto, para uma implementação robusta no **WhatsApp Web (Oracle)**, algumas melhorias são críticas para garantir o controle humano e a precisão das respostas.

## 🟢 Pontos Fortes (O que já está bom)
- **Separação de Regras (Pode vs Não Pode):** Essencial para orientar o LLM sobre limites éticos e comerciais.
- **Tom de Voz Humanizado:** As opções de personalidade ajudam a manter a marca consistente.
- **Controle de Transbordo:** O sistema de "Tentativas Máximas" evita que o cliente fique frustrado com uma IA em loop.
- **Preview em Tempo Real:** Permite validar a saudação antes de salvar.

## 🔴 Pontos de Melhoria (Gargalos para o WhatsApp Real)

### 1. Botão de "Pausa" no Chat Individual (Crítico)
**Problema:** Atualmente, não há um botão claro para o atendente humano "desligar" a Sônia em uma conversa específica. Se o humano assumir e a IA continuar respondendo, gera confusão e amadorismo.
**Proposta:** Adicionar um toggle `🤖 IA ATIVA` no cabeçalho do chat de atendimento. Ao desativar, a Sônia para de processar mensagens desse contato.

### 2. Base de Conhecimento (Knowledge Base / RAG)
**Problema:** A IA atual se baseia apenas em regras de comportamento. Ela não tem um campo para "estudar" arquivos, FAQs ou informações específicas da empresa que não cabem no campo de Regras.
**Proposta:** Adicionar o **Passo 5: Conhecimento**. Um campo de texto livre (ou upload de PDF/TXT) onde o usuário cola manuais de produtos, políticas de entrega e FAQs.

### 3. Integração Dinâmica com Produtos
**Problema:** A Sônia precisa saber quais produtos estão em estoque no momento.
**Proposta:** Criar uma regra interna (prompt) que injeta a lista de produtos da aba "Produtos" como contexto para a IA, permitindo que ela responda sobre preços e SKUs de forma dinâmica.

### 4. Horário de Funcionamento Reativo
**Problema:** O campo de horário é apenas informativo.
**Proposta:** Implementar uma mensagem específica de "Fora de Horário", onde a Sônia apenas avisa que o atendimento humano retorna em breve, em vez de tentar vender/qualificar fora do expediente.

---

## Próximos Passos Sugeridos:
1. **Implementar o Toggle de IA** no header do chat (`whatsapp` tab).
2. **Adicionar a Seção de Conhecimento** no wizard de configuração da IA.
3. **Refinar a visualização de "Sônia digitando..."** no chat para dar realismo.

> [!IMPORTANT]
> A implementação no **Oracle Cloud (WhatsApp Web)** exigirá que estas configurações sejam persistidas no banco de dados para que o motor da IA as consulte em tempo real. Atualmente, vejo que muitas estão no `localStorage`.

Deseja que eu proceda com a implementação dessas melhorias na interface agora?

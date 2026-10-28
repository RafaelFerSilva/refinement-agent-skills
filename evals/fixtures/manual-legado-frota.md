# Manual de Operações RouteWise (v1.4, Referência Legada)

Documento interno da implantação inicial da frota. Material fictício usado apenas para testes deste pacote.

## 1. Visão Geral e Perfis de Acesso

O RouteWise monitora veículos comerciais de entrega em rotas ativas para que a matriz reaja a ocorrências em rodovia e acompanhe a quilometragem diária.

Três perfis acessam a plataforma hoje:
- **Operador de despacho** (também chamado em slides antigos de **Agente da central**): acompanha alertas ativos durante o turno e liga para o motorista quando uma violação é detectada.
- **Diretor de operações**: analisa o relatório operacional diário dos veículos e define metas anuais de segurança. Não encerra alertas individuais.
- **Técnico de dispositivo**: cadastra e substitui equipamentos embarcados nos caminhões.

## 2. Equipamento Embarcado e Telemetria

Cada veículo possui um **Rastreador** (chamado de **Caixa GPS** na planilha de compras), dos modelos `RT-100` ou `RT-300`. A cada 30 segundos o equipamento envia uma leitura com posição, velocidade e horário de captura por meio do gateway externo **TeleTrack** via webhook HTTPS. Quando o caminhão atravessa área sem cobertura celular, leituras acumuladas chegam de forma retroativa assim que o sinal volta; o limite máximo do lote de reenvio no webhook e o tratamento de leituras duplicadas ficam sob responsabilidade do time de backend e não estão documentados aqui.

Unidades antigas `RT-100` não enviam percentual de bateria nem dados de acelerômetro.

## 3. Alertas e Relatórios em Produção

- **Alerta de velocidade:** segundo o memorando de implantação de 2024, um alerta é aberto automaticamente sempre que a leitura do veículo ultrapassa 100 km/h. Apenas o agente da central / operador de despacho encerra alertas ativos, informando um motivo obrigatório.
- **Alerta de cerca eletrônica:** previsto na fase 1; o status atual em produção não está claro neste manual.
- **Relatório operacional:** consolidação diária por veículo com quantidade de leituras e velocidade máxima. Alguns gestores questionaram se alertas encerrados também entram nesse relatório.
- **Exportação de faturamento SAP:** citada em notas do financeiro como envio noturno de quilometragem, porém sem contrato de API, política de retentativa ou confirmação de ativação em produção nas pastas de operações.

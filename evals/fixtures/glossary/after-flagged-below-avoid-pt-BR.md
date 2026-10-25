# RouteWise

Plataforma fictícia de gestão de frota logística, usada só como material de teste deste pacote.

## Language

**Operador de despacho**:
A pessoa que acompanha os veículos em rota e aciona motoristas quando algo foge do planejado.
_Avoid_: usuário, despachante, central

**Diretor de operações**:
Quem responde pelo resultado da operação e apresenta ao board. Define o que entra no MVP.
_Avoid_: gestor, cliente

**Técnico de dispositivos**:
Quem instala e mantém os rastreadores nos veículos.
_Avoid_: suporte, campo

**Rastreador**:
O dispositivo GPS embarcado no veículo. Modelos antigos não enviam nível de bateria nem acelerômetro.
_Avoid_: dispositivo, GPS, tracker

**Leitura**:
Um registro enviado pelo rastreador: posição, velocidade e horário. Pode chegar retroativa quando o rastreador fica sem sinal.
_Avoid_: ping, evento, telemetria (é o conjunto das leituras, não uma)

**Relatório operacional**:
O consolidado diário das leituras por veículo, consumido pelo operador de despacho e pelo diretor de operações.
_Avoid_: dashboard, extrato
`[A CONFIRMAR: PO]` se esta definição passa a incluir também estado de alertas (ex.: marca de veículo silenciado), levantado na sabatina da US-245 e não decidido pelo PO.

**Em tempo real**:
Termo sem latência acordada. Toda ocorrência exige SLA a confirmar com o diretor de operações.
_Avoid_: instantâneo, online

**Painel de despacho**:
Tela usada pelo operador de despacho para acompanhar os veículos em rota e receber alertas (pop-up e som) desencadeados pelas leituras.
_Avoid_: dashboard, tela de alertas

**Silenciamento (de alerta de velocidade)**:
Ação do operador de despacho que suprime, para um veículo específico, o pop-up e o som do alerta de velocidade no painel de despacho, por 15 minutos, 30 minutos (padrão) ou 1 hora. O alerta continua sendo registrado; ao fim do período volta a disparar no painel sem aviso ao operador. Qualquer operador de plantão, não só quem silenciou, pode reativá-lo antes do fim do período.
_Avoid_: mutar, pausar alerta

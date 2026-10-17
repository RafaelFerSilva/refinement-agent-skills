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

**Em tempo real**:
Termo sem latência acordada. Toda ocorrência exige SLA a confirmar com o diretor de operações.
_Avoid_: instantâneo, online

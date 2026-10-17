# US-318: Encerrar alerta de velocidade

Status: PRONTA
Azure: 318

## Narrativa

Como operador de despacho, quero encerrar um alerta de velocidade informando o motivo, para que alertas já tratados saiam da fila ativa do despacho.

## Critérios de aceite

Cenário: encerramento de alerta ativo
  Dado um alerta de velocidade em estado "ativo" na fila do operador de despacho
  Quando o operador encerra o alerta informando um motivo da lista (motorista contatado, falso positivo, veículo parado)
  Então o alerta passa ao estado "encerrado"
  E o sistema registra o motivo, o operador e o horário do encerramento

Cenário: encerramento sem motivo
  Dado um alerta de velocidade em estado "ativo"
  Quando o operador tenta encerrar o alerta sem informar motivo
  Então o alerta permanece "ativo"
  E o sistema informa que o motivo é obrigatório

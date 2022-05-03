

## Nomenclatura routing keys
empresa.Servicio.v1.event.entidad.evento
houndy.userService.v1.event.user.created
## Nomenclatura colas
servicio.entidad.accion_on_evento
authService.authUser.createAuthUser_on_user.created


new Message

{
  data: {
    type: 'houndy.userService.v1.event.user.created',
    occurred_on: event.occurredOn,
    id: event.eventId,
    attributes: {
      'id': 'id del recurso',
      'user':{user}
    }
  },
  meta: {}
}


this.logger.info(`[RabbitMqEventBus] Event to be published: ${event.eventName}`);

## Codigos git

Construccionn: :construction: | Test: :test_tube:
Bug: :space_invader: | Launch: :rocket:
Alert: :warning: | Refactor: :recycle: :poop:
Aggggg: | :feelsgood:
<a href="https://github.com/yocheco/micro-service-event-template/actions/workflows/test.yaml">
    <img src="https://github.com/yocheco/micro-service-event-template/actions/workflows/test.yaml/badge.svg" />
</a>

## Errors
throw new APIError(errMessage, 'saveInDB', HttpStatusCode.ALREADY_EXISTS)
throw new BaseError('Could not perform async operation', err, 'saveInDB')

## Nomenclatura routing keys
empresa.Servicio.v1.event.entidad.evento
houndy.userService.v1.event.user.created
## Nomenclatura colas
servicio.entidad.accion_on_evento
authService.authUser.createAuthUser_on_user.created


## Nomenclatura Message
new Message

{
  data: {
    type: 'houndy.userService.v1.event.user.created',
    occurred_on: event.occurredOn,
    id: event.eventId,
    attributes: {
      'id': 'id del recurso',
      'user':{ user } // Generic type
    }
  },
  meta: {}
}

## Nomenclatura log
this.logger.info(`[RabbitMqEventBus] Event to be published: ${event.eventName}`);

## Codigos git

Construccionn: :construction: | Test: :test_tube:
Bug: :space_invader: | Launch: :rocket:
Alert: :warning: | Refactor: :recycle: :poop:
Aggggg: | :feelsgood:

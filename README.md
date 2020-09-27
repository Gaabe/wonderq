# WonderQ
Sample project for a basic message queue service

## Improvements and possible problems
This project was built as an example of a queue service, the most direct approach to something like this to be used in production would be to use an already existing queue service, that can assure performance and stability, like Kafka or rabbitMQ. But since the purpose is to make this project a viable solution, here are some things to take into consideration:

### Storage
  This projects uses volatile storage, and this would need to be addressed, since we don't want to lose our messages with every server restart. Using a db like postgres would solve this problem, but it wouldn't be the best option performance wise, and for high loads would cause problems.
    
### Atomicity
  This service moves messages from one queue to another, and the way it is implemented is prone to failure if there is any problems in the server after the message is removed from one queue and before it is added to another. Having some kind of storage that enables these kinds of operations to be atomic solves this problem, like db transactions.
    
### Timeout processing
  Since the storage is bound to this single application, the message process timeout was implemented with one setTimeout routine for each message, for high loads this would perform awfully. A better approach would be to have a cron that would handle multiple message timeouts from time to time.
    
### High loads
  Even the best services can only handle a determined number of requests, so it is necessary to take measure to prevent attacks or bad usage of the api. To achieve this, it is needed to implement some kind of rate limit, be it global, or by ip. The package express-rate-limit handles this very well and it is easily integrated with express servers.
    
### Messages being processed twice
  The way this service was designed, allows messages to be processed twice, when the consumer takes too long to inform that the message was processed. For some use cases this might be a problem and this would need to be addressed. In those cases, it is possible to move the timedout messages to a separate queue, where the consumer that got the message would be logged, and then the message status could be reviewed, before deciding if it should really go back to the queue.
    
### Availability
  This service was intended to run on a single server, but this makes it unable to be updated or be serviced without any downtime. Some changes mentioned above would allow this to be run on a kubernetes cluster with multiple replicas, which would enable these operations with no down time.
    
### Authentication
  Authetincation was out of scope for this project, but it would be needed in most cases to prevent unauthorized users to interact with the api.

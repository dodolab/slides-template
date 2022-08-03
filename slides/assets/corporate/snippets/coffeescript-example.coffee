#Basic class definition
class Animal
  constructor: (@name) ->
  cantSeeMe = "i am private"
  @staticThing = "i am as static as the team's velocity"
  sayHello: ->
    console.log "Hello, I am a #{@name}!"
    privateMethod()
  privateMethod = ->
  	console.log "This cant be invoked outside of the instance"

cat = new Animal("cat")
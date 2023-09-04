import { Artifact } from "../artifact";

it('Implements Optimistic Concurrency Control', async () => {
  // Create an instance of the artifact
  const artifact = Artifact.build({
    title: 'Vase',
    price: 200,
    userId: '123'
  })

  //save the artifact to the DB
  await artifact.save()

  // fetch the same artifact twice
  const firstInstance = await Artifact.findById(artifact.id)
  const secondInstance = await Artifact.findById(artifact.id)

  // make two separate changes to the artifact we fetched
  firstInstance!.set({price: 10})
  secondInstance!.set({price: 15})

  // save the first fetched artifact
  await firstInstance!.save()

  // save the second fetched artifact and expect error
  try {
    await secondInstance!.save()
  } catch (err) {
    return
  }
  
  throw new Error('Should nto reach this point')

})

it('Increments verison number on multiple saves', async () => {

  const artifact = Artifact.build({
    title: 'Vase',
    price: 200,
    userId: '123'
  })

  await artifact.save()
  expect(artifact.version).toEqual(0)
  await artifact.save()
  expect(artifact.version).toEqual(1)

})
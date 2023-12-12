// creating variables that store the location of our icons so that we can 
// reuse them in the code
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//makes an array instances from all of the trash can icons  and adds an
//event listener to each one of them
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//makes an array instances from all of the items icons and adds an
//event listener to each one of them
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//makes an array instances from all of the itemsCompleted icons and adds an
//event listener to each one of them
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// sends a request to the server.js to delete an object with the value matching
// the variable itemText
async function deleteItem(){
    //sets a reusable variable of what we would like to delete
    const itemText = this.parentNode.childNodes[1].innerText
    //try..catch statement to send our fetch 
    try{
    //variable response with the variable of a fetch to delete an item from the db
        const response = await fetch('deleteItem', {
    //setting up the details of our delete fetch method for telling which thing to do 
    //headers for what the content type is, body what it is we are taking away from the body and where
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
    //awaiting the response for our fetch by using the variable we created
        const data = await response.json()
        //logging the data to see what we have
        console.log(data)
        //refreshing the page
        location.reload()
        //if there is a problem log the the error message
    }catch(err){
        console.log(err)
    }
}
//async function for marking the task complete
async function markComplete(){
//variable for the item we will be checking
    const itemText = this.parentNode.childNodes[1].innerText
//try..catch to update the page with a checkmark to show that we completed a task
    try{
//variable with propertry of a fetch request to mark an item completed
        const response = await fetch('markComplete', {
        //method is the type of change we are making (an update), headers = content type
        //body where we will make the change in the body
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //once we get the response we store it in variable data
        const data = await response.json()
        //log it and then reload the page
        console.log(data)
        location.reload()
        //if there is an error log it
    }catch(err){
        console.log(err)
    }
}
//exact opposite of markComplete but updating to unmark the checked item
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
    //variable with propertry of a fetch request to mark an item completed
        const response = await fetch('markUnComplete', {
      //method is the type of change we are making (an update), headers = content type
        //body where we will make the change in the body
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        //if there is an error log it and then refresh
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
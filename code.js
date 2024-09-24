function init() {
  let infoText = document.getElementById('infoText')
  infoText.innerHTML = 'Ladataan tehtävälista palvelimelta, odota...'
  loadTodos();
}

async function loadTodos() {
  let response = await fetch('http://localhost:3000/todos')
  let todos = await response.json()
    console.log(todos)
    showTodos(todos);
}

function showTodos(todos) {
  let todosList = document.getElementById('todosList')
  let infoText = document.getElementById('infoText')
  // no todos
  if (todos.length === 0) {
    infoText.innerHTML = 'Ei tehtäviä'
  } else {    
    todos.forEach(todo => {
        let li = createTodoListItem(todo)        
        todosList.appendChild(li)
    })
    infoText.innerHTML = ''
  }
}

async function addTodo() {
  let newTodo = document.getElementById('newTodo')
  const data = { 'text': newTodo.value }
  const response = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let todo = await response.json()
  let todosList = document.getElementById('todosList')
  let li = createTodoListItem(todo)
  todosList.appendChild(li)

  let infoText = document.getElementById('infoText')
  infoText.innerHTML = ''
  newTodo.value = ''
}

function createTodoListItem(todo) {
    // luodaan uusi LI-elementti
    let li = document.createElement('li')
      // luodaan uusi id-attribuutti
    let li_attr = document.createAttribute('id')
      // kiinnitetään tehtävän/todon id:n arvo luotuun attribuuttiin 
    li_attr.value= todo._id
      // kiinnitetään attribuutti LI-elementtiin
    li.setAttributeNode(li_attr)
      // luodaan uusi tekstisolmu, joka sisältää tehtävän/todon tekstin
    let text = document.createTextNode(todo.text)
      // lisätään teksti LI-elementtiin
    li.appendChild(text)
      // luodaan uusi SPAN-elementti, käytännössä x-kirjan, jotta tehtävä saadaan poistettua
    let span = document.createElement('span')
      // luodaan uusi class-attribuutti
    let span_attr = document.createAttribute('class')
      // kiinnitetään attribuuttiin delete-arvo, ts. class="delete", jotta saadaan tyylit tähän kiinni
    span_attr.value = 'delete'
      // kiinnitetään SPAN-elementtiin yo. attribuutti
    span.setAttributeNode(span_attr)
      // luodaan tekstisolmu arvolla x
    let x = document.createTextNode(' x ')
      // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
    span.appendChild(x)
      // määritetään SPAN-elementin onclick-tapahtuma kutsumaan removeTodo-funkiota
    span.onclick = function() { removeTodo(todo._id) }
      // lisätään SPAN-elementti LI-elementtin
    li.appendChild(span)
      // palautetaan luotu LI-elementti
      // on siis muotoa: <li id="mongoIDXXXXX">Muista soittaa...<span class="remove">x</span></li>
    return li
}

async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/'+id, {
      method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
  
    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
      let infoText = document.getElementById('infoText')
      infoText.innerHTML = 'Ei tehtäviä'
    }
}
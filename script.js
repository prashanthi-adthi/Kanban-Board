let boardData = {
    todo: [],
    inprogress: [],
    done: []
};

window.onload = function() {
    const savedData = localStorage.getItem('kanbanBoardData');
    if (savedData) {
        boardData = JSON.parse(savedData);
    }
    renderBoard();
};

function saveToLocalStorage() {
    localStorage.setItem('kanbanBoardData', JSON.stringify(boardData));
}

function renderBoard() {
    const columns = ['todo', 'inprogress', 'done'];
    
    columns.forEach(columnId => {
        const listElement = document.querySelector(`#${columnId} .card-list`);
        listElement.innerHTML = ''; 

        boardData[columnId].forEach((cardText, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `${columnId}-${index}`;
            card.setAttribute('draggable', 'true');
           
            card.ondragstart = (e) => drag(e, columnId, index);

            card.innerHTML = `
                <span>${cardText}</span>
                <button class="delete-btn" onclick="deleteCard('${columnId}', ${index})">×</button>
            `;
            listElement.appendChild(card);
        });
    });
}

function addCardPrompt(columnId) {
    const text = prompt("Enter card text:");
    if (text && text.trim() !== "") {
        boardData[columnId].push(text.trim());
        saveToLocalStorage();
        renderBoard();
    }
}

function deleteCard(columnId, index) {
    boardData[columnId].splice(index, 1);
    saveToLocalStorage();
    renderBoard();
}

function drag(event, fromColumn, index) {
    event.dataTransfer.setData("fromColumn", fromColumn);
    event.dataTransfer.setData("cardIndex", index);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, toColumn) {
    event.preventDefault();
    
    const fromColumn = event.dataTransfer.getData("fromColumn");
    const cardIndex = parseInt(event.dataTransfer.getData("cardIndex"));

    if (fromColumn === toColumn) return;

    const [movedCard] = boardData[fromColumn].splice(cardIndex, 1);
    boardData[toColumn].push(movedCard);

    saveToLocalStorage();
    renderBoard();
}
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('sudoku-grid');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exampleBtn = document.getElementById('example-btn');
    const messageDiv = document.getElementById('message');
    
    let selectedCell = null;
    
    // Create the Sudoku grid
    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.dataset.row = Math.floor(i / 9);
            input.dataset.col = i % 9;
            
            // Only allow numbers 1-9
            input.addEventListener('input', function(e) {
                const value = e.target.value;
                if (value && !/^[1-9]$/.test(value)) {
                    e.target.value = '';
                }
            });
            
            cell.appendChild(input);
            grid.appendChild(cell);
        }
    }
    
    // Get current board state
    function getBoard() {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        const inputs = document.querySelectorAll('.cell input');
        
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            if (input.value) {
                board[row][col] = parseInt(input.value);
            }
        });
        
        return board;
    }
    
    // Set board state
    function setBoard(board) {
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            input.value = board[row][col] !== 0 ? board[row][col] : '';
        });
    }
    
    // Solve button click handler
    solveBtn.addEventListener('click', async function() {
        const board = getBoard();
        
        try {
            const response = await fetch('/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ board })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                setBoard(data.solution);
                messageDiv.textContent = 'Sudoku solved!';
                messageDiv.style.color = '#4CAF50';
            } else {
                messageDiv.textContent = 'No solution exists for this puzzle';
                messageDiv.style.color = '#d32f2f';
            }
        } catch (error) {
            messageDiv.textContent = 'Error solving Sudoku: ' + error.message;
            messageDiv.style.color = '#d32f2f';
        }
    });
    
    // Clear button click handler
    clearBtn.addEventListener('click', function() {
        createGrid();
        messageDiv.textContent = '';
    });
    
    // Example button click handler
    exampleBtn.addEventListener('click', function() {
        const exampleBoard = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        setBoard(exampleBoard);
        messageDiv.textContent = 'Example puzzle loaded';
        messageDiv.style.color = '#2196F3';
    });
    
    // Initialize the grid
    createGrid();
});
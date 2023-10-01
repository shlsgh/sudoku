from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def is_valid(board, row, col, num):
    # Check row
    if num in board[row]:
        return False
    
    # Check column
    for i in range(9):
        if board[i][col] == num:
            return False
    
    # Check 3x3 box
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def solve_sudoku(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve_sudoku(board):
                            return True
                        board[row][col] = 0
                return False
    return True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    board = data['board']
    
    # Make a copy to avoid modifying the original
    board_copy = [row[:] for row in board]
    
    if solve_sudoku(board_copy):
        return jsonify({'status': 'success', 'solution': board_copy})
    else:
        return jsonify({'status': 'fail', 'message': 'No solution exists'})

if __name__ == '__main__':
    app.run(debug=True)
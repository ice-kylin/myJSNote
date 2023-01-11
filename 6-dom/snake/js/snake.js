"use strict";

/*
 * # 贪吃蛇
 */

/*
 * ## 绑定按键事件
 *
 * - 键盘事件只能绑定给可以获取焦点的元素或 `document`
 * - 通过事件对象可以读取到用户按的是哪个按键
 *   - `keyCode`
 *   - `key`
 * - 当按着某个按键不送时，按键按下事件会持续触发
 *   - 但是第一次和第二次触发的间隔会比较长
 */
const info = {
    addScore() {
        this.score++;
        this.scoreElement.textContent = `${this.score}`;
    },
    gameStatus: false,
    level: 0,
    levelElement: document.getElementById("level"),
    nextDirection: null,
    prevDirection: null,
    reset() {
        this.score = 0;
        this.level = 0;
        this.speed = 300;
        this.scoreElement.textContent = `${this.score}`;
        this.levelElement.textContent = `${this.level + 1}`;
    },
    score: 0,
    scoreElement: document.getElementById("score"),
    setNextDirection(p) {
        if (
            {"u": "d", "r": "l", "d": "u", "l": "r"}[p] !== this.prevDirection
            || this.prevDirection == null
        ) {
            this.nextDirection = p;
        }
    },
    speed: 300,
    updateLevel() {
        this.level = Math.trunc(this.score / 3);
        this.levelElement.textContent = `${this.level + 1}`;
        const speed = 300 - this.level * 15;
        this.speed = speed < 150 ? 150 : speed;
    },
};

const snake = {
    addBody(x, y) {
        const oldHead = this.getHead();

        this.body.insertAdjacentElement(
            "afterbegin",
            document.createElement("div"),
        );

        const newHead = this.getHead();
        newHead.style.left = `${oldHead.offsetLeft + x}px`;
        newHead.style.top = `${oldHead.offsetTop + y}px`;
    },
    bodies: document
        .getElementById("snake")
        .getElementsByTagName("div"),
    body: document
        .getElementById("snake"),
    getHead() {
        return this.bodies[0];
    },
    getHeadPosition() {
        const head = this.getHead();

        return {
            x: head.offsetLeft,
            y: head.offsetTop,
        };
    },
    getPositions() {
        const ps = [];
        for (const body of this.bodies) {
            ps.push(
                {
                    x: body.offsetLeft,
                    y: body.offsetTop,
                },
            );
        }

        return ps;
    },
    getTail() {
        return [...this.bodies].at(-1);
    },
    move(x, y) {
        const head = this.getHead();
        const tail = this.getTail();

        tail.style.left = `${head.offsetLeft + x}px`;
        tail.style.top = `${head.offsetTop + y}px`;

        this.body.insertAdjacentElement(
            "afterbegin",
            tail,
        );
    },
    reset() {
        this.body.innerHTML = "";
        this.body.insertAdjacentElement(
            "afterbegin",
            document.createElement("div"),
        );

        const head = this.getHead();
        head.style.left = `0px`;
        head.style.top = `0px`;
    },
};

const food = {
    changePosition(x, y) {
        this.foodElement.style.left = `${x}px`;
        this.foodElement.style.top = `${y}px`;
    },
    foodElement: document.getElementById("food"),
    getPosition() {
        return {
            x: this.foodElement.offsetLeft,
            y: this.foodElement.offsetTop,
        };
    },
    randomChangePosition(ps) {
        let x;
        let y;

        let flag = true;
        while (flag) {
            x = getRandomInt(0, 29) * 10;
            y = getRandomInt(0, 29) * 10;

            for (const p of ps) {
                if (p.x === x || p.y === y) {
                    flag = true;
                    break;
                } else if (flag) {
                    flag = false;
                }
            }
        }

        this.changePosition(x, y);
    },
};

function getRandomInt(min, max) {
    return Math.trunc(Math.random() * (max - min)) + min;
}

function isSamePosition(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

function startGame() {
    info.reset();
    snake.reset();
    food.randomChangePosition(snake.getPositions());

    setTimeout(function move() {
        let x, y;
        switch (info.nextDirection) {
            case "u": {
                x = 0;
                y = -10;
                break;
            }
            case "d": {
                x = 0;
                y = 10;
                break;
            }
            case "l": {
                x = -10;
                y = 0;
                break;
            }
            case "r": {
                x = 10;
                y = 0;
                break;
            }
        }

        const oldHeadPosition = snake.getHeadPosition();
        const nextHeadPosition = {
            x: oldHeadPosition.x + x,
            y: oldHeadPosition.y + y,
        };

        // 撞墙判断
        if (
            nextHeadPosition.x > 290 ||
            nextHeadPosition.x < 0 ||
            nextHeadPosition.y > 290 ||
            nextHeadPosition.y < 0
        ) {
            alert("撞墙了！游戏结束！");

            info.prevDirection = null;
            info.gameStatus = false;
            return;
        }

        // 撞自己判断
        for (const bodyPosition of snake.getPositions().slice(0, -1)) {
            if (isSamePosition(bodyPosition, nextHeadPosition)) {
                alert("撞到自己了！游戏结束！");

                info.prevDirection = null;
                info.gameStatus = false;
                return;
            }
        }

        if (info.gameStatus) {
            // 吃东西判断
            if (isSamePosition(food.getPosition(), nextHeadPosition)) {
                snake.addBody(x, y);
                info.addScore();
                info.updateLevel();
                food.randomChangePosition(snake.getPositions());
            } else {
                snake.move(x, y);
            }

            info.prevDirection = info.nextDirection;
            setTimeout(move, info.speed);
        }
    }, info.speed);
}

document.addEventListener("keydown", e => {
    const key = e.key;

    if ([
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
    ].includes(key)) {
        {
            let np;
            switch (key) {
                case "ArrowUp" : {
                    np = "u";
                    break;
                }
                case "ArrowDown": {
                    np = "d";
                    break;
                }
                case "ArrowLeft": {
                    np = "l";
                    break;
                }
                case "ArrowRight": {
                    np = "r";
                    break;
                }
            }

            info.setNextDirection(np);
        }

        if (!info.gameStatus) {
            info.gameStatus = true;
            startGame();
        }
    }
});

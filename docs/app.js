let newGame;
console.log(sessionStorage);
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

const user = {
    _money: 0,
    toolKit: [
        {
            name: "teeth",
            has: true,
            cost: 0,
            profit: 1,
            index: 0,
            reps: 6,
        },
        {
            name: "scissor",
            has: false,
            cost: 5,
            profit: 5,
            index: 1,
            reps: 30,
        },
        {
            name: "pushmower",
            has: false,
            cost: 25,
            profit: 50,
            index: 2,
            reps: 300,
        },
        {
            name: "powermower",
            has: false,
            cost: 250,
            profit: 100,
            index: 3,
            reps: 600,
        },
        {
            name: "team",
            has: false,
            cost: 500,
            profit: 250,
            index: 4,
            reps: 1500,
        }
    ],

    getMoney() {
        return this._money;
    },
    setMoney(newMoney) {
        this._money = newMoney;
    }
}


class Game {
    constructor() {
        this.user = user;
        this._currentTool = this.user.toolKit[0];
        this._lawn = document.querySelector(".lawn");
        this._message = document.querySelector(".message");
        this._items = document.querySelectorAll("li");
        this._clickMessage = document.querySelector(".clickGrass");
        this._moneyHTML = document.querySelector(".js-money");
        this._items[0].addEventListener("click", () => { switchItem(this._items[0])});
        this._lawn.addEventListener("click", clickGrass );
        this._hr = document.querySelector(".hr");
    }

    generatePhrase() {
        let tool = this._currentTool;
        let phrases = [
            `Mowing Complete. You Cut ${tool.reps} Blades Of Grass. <br> In This Utopia, <br> The Markets Paying Nearly 17 Cents A Blade.`,
            `Truly An Olympic Sized Feat! <br> You Shredded ${tool.reps} Blades`,
            `Faster Than My Father On A Sunday. <br> Right Before The Ball Game. <br> Blades Cut: ${tool.reps}`,
            `The Nearby Cows Are Starting To Get Concerned! <br> ${tool.reps} Strips Of Green Less For Them.`,
            `Who Are You Selling This Stuff To? <br> You Made $${tool.profit}`,
            `Purrrrrrr <br> ${tool.reps} Blades Cut.`
        ]
        let rand = Math.floor(Math.random() * phrases.length);
        return phrases[rand];
    }

    giveOutput() {
        let output;
        let balance = this.user.getMoney();
        let nextTool = this.nextTool();
        if (typeof(nextTool) === "number") {
            return `Good Morning Mower! <br> You Have $${balance}. <br> Reach $1000 To Win.`;
        }
        output = `Good Morning Mower! <br> Next Avalable Tool: ${capitalize(nextTool.name)}. <br> Cost: ${nextTool.cost}.`;
        if (this.user.getMoney() >= nextTool.cost) {
            output = nextTool;
        }
        return output;
    }

    nextTool() {
        let _nextTool = "scissors";
        let tools = this.user.toolKit;
        for (let i = 0; i < tools.length; i++) {
            if (!tools[i].has) {
                _nextTool = tools[i];
                return _nextTool;
            }
        }
        return 0;
    }

    newTool(tool) {
        let newmoney = this.user.getMoney();
        tool.has = true;
        newmoney -= tool.cost;
        this.user.setMoney(newmoney);
        this._moneyHTML.innerHTML = this.user.getMoney();
        return tool;
    }

    moneyFromDay() {
        let newMoney = this.user.getMoney();
        this.user.setMoney(newMoney + 1);
        this._moneyHTML.innerHTML = this.user.getMoney();
    }

    mowLawn() {
        this._lawn.innerHTML = "^".repeat(30);
        let msg = this.giveOutput();
        if (typeof(msg) === "object") {
            setMessage( `You Have Enough For A ${capitalize(msg.name)}! <br> The Next Step In Your Mowing Career.`);
            this._clickMessage.innerHTML = "Click Me To Buy."
            this._clickMessage.addEventListener("click", htmlBought)
        } else {
            setMessage(msg)
        }
        this._lawn.addEventListener("click", clickGrass);
    }

    hasWon() {
        if (this._currentTool.name === "team" && this.user.getMoney() >= 1000) {
            return true;
        } else {
            return false;
        }
    }
}

function setMessage(msg) {
    newGame._message.innerHTML = msg;
    newGame._clickMessage.innerHTML = "Keep Mowing!"
}

function switchItem(item) {
    let tool = item.getAttribute("tool");
    let toolKit = newGame.user.toolKit;
    for (let i = 0; i < toolKit.length; i++) {
        if (toolKit[i].name === tool) {
            tool = toolKit[i];
            break;
        }
    }
    for (let i = 0; i < newGame._items.length; i++) {
        if (i == tool.index) {
            newGame._items[i].style.textDecoration = "underline black 1px";
        } else {
            newGame._items[i].style.textDecoration = "none";
        }
    }
    newGame._currentTool = tool;
    if (tool.name == "teeth") {
        newGame._message.innerHTML = `Oh Boy! ${capitalize(newGame._currentTool.name)}<br>This Will Surely Shred This Lawn.`;
    } else {
        newGame._message.innerHTML = `Oh Boy! A ${capitalize(newGame._currentTool.name)} <br> This Will Surely Shred This Lawn.`;
    }
    newGame._clickMessage.innerHTML = "Get Going. Get Mowing."
}

function boughtTool (tool) {
    for (let i = 0; i < newGame._items.length; i++) {
        if (newGame._items[i].getAttribute("tool") === tool.name) {
            newGame._items[i].innerHTML = capitalize(tool.name);
            newGame._items[i].addEventListener("click", () => { switchItem (newGame._items[i])});
            break;
        }
    }
}

function lawnRefresh() {
    newGame._hr.removeEventListener("click", lawnRefresh);
    newGame._hr.style.zIndex ="0";
    if (newGame.hasWon()) {
        newGame._message.innerHTML = "Well Now Thats A Sustainable Business! <br> You Win, You Mow Monster.";
    } else {
        newGame.mowLawn();
    }
}

function htmlBought() {
    newGame._clickMessage.removeEventListener("click", htmlBought);
    let tool = newGame.nextTool();
    tool = newGame.newTool(tool);
    boughtTool(tool);
    setMessage(`Bought ${capitalize(tool.name)}! Click It To Enable`)
}

function clickGrass() {
    newGame._lawn.removeEventListener("click", clickGrass);
    newGame._message.innerHTML = `Mowing In Progress With Your ${capitalize(newGame._currentTool.name)}.`;
    newGame._clickMessage.innerHTML = "";
    let tool = newGame._currentTool;
    if (tool == null) {
        return;
    }
    let totalTime = 8000;
    let bladesCut = tool.reps;
    if (tool.name === "teeth") {
        let repeater = 30;
        for (let i = 0; i < 7; i++) {
            if (i == 6) newGame.moneyFromDay();
            setTimeout(function () {
                newGame._lawn.innerHTML = '^'.repeat(repeater);
                repeater --;
            }, i * (totalTime / bladesCut));
        }
    } else {
        for (let times = 0; times < (bladesCut / 30); times++) {
            setTimeout(() => {
                let repeater = 29;
                for (let i = 1; i < 32; i++) {
                    setTimeout(function () {
                        if ((i % 6) == 0) newGame.moneyFromDay();
                        if (i == 31) {
                            newGame._lawn.innerHTML = "";
                        } else {
                            newGame._lawn.innerHTML = '^'.repeat(repeater);
                        }
                      repeater --;
                    }, i * (totalTime / bladesCut));
                }
                newGame._lawn.innerHTML = "^".repeat(30);
            }, (times * (31 * totalTime / bladesCut)));
        }
    }
    setTimeout(() => {
        postMow();
    }, 10000);
}

function postMow () {
    newGame._message.innerHTML = newGame.generatePhrase();
    newGame._clickMessage.innerHTML = "Click The Lawn For Instant Gratification."
    newGame._hr.style.zIndex ="2";
    newGame._hr.addEventListener("click", lawnRefresh);
}

function loadingScreen() {
    newGame = new Game();
    clickGrass();
    firstMow.removeEventListener("click", loadingScreen);
}


let firstMow = document.querySelector(".lawn");
firstMow.addEventListener("click", loadingScreen);


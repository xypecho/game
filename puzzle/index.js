(() => {
    /** 游戏配置 */
    const gameConfig = {
        width: 500,
        height: 500,
        rows: 2, // 行数
        cols: 2, //列数
        itemWidth: 0, // 每个方块的宽度
        itemHeight: 0, // 每个方块的高度
        imgurl:
            "https://img0.baidu.com/it/u=3837837821,4161573661&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
        isOver: false, //游戏是否结束
        dom: document.querySelector("#game") //游戏的dom对象
    };
    /** 包含方块信息的数组 */
    const blocks = [];

    window.onload = function () {
        document.getElementById("start").addEventListener("click", shuffle);
        init()
    };
    function init() {
        // 初始化游戏的容器
        initGameDom()
        // 初始化方块
        initBlocks()
        // 打乱方块
        shuffle()
        // 注册点击事件
        registerEvent();
    }
    function initGameDom() {
        gameConfig.dom.style.width = `${gameConfig.width}px`
        gameConfig.dom.style.height = `${gameConfig.height}px`
        gameConfig.dom.style.border = "1px solid #ccc";
        gameConfig.dom.style.position = "relative";
        gameConfig.itemWidth = gameConfig.width / gameConfig.cols;
        gameConfig.itemHeight = gameConfig.height / gameConfig.rows;
    }
    function initBlocks() {
        for (var i = 0; i < gameConfig.rows; i++) {
            for (var j = 0; j < gameConfig.cols; j++) {
                let isVisible = true
                // 右下角的方块不可见
                if (i === gameConfig.rows - 1 && j === gameConfig.cols - 1) {
                    isVisible = false
                }
                const block = new Block(gameConfig.itemWidth * i, gameConfig.itemHeight * j, isVisible)
                blocks.push(block);
            }
        }
    }
    /**
     * 方块的构造函数
     * @param {*} left 
     * @param {*} top 
     * @param {*} isVisible 是否可见
     */
    function Block(left, top, isVisible) {
        this.left = left; //当前的横坐标
        this.top = top; //当前的纵坐标
        this.correctLeft = this.left; //正确的横坐标
        this.correctTop = this.top; //正确的纵坐标
        this.isVisible = isVisible; //是否可见

        this.dom = document.createElement("div");
        this.dom.style.width = `${gameConfig.itemWidth}px`;
        this.dom.style.height = `${gameConfig.itemHeight}px`;
        this.dom.style.background = `url(${gameConfig.imgurl}) -${this.correctLeft}px -${this.correctTop}px`;
        this.dom.style.border = "1px solid #fff";
        this.dom.style.boxSizing = "border-box";
        this.dom.style.cursor = "pointer";
        this.dom.style.transitionDuration = '.2s'
        this.dom.style.position = "absolute";
        if (!isVisible) {
            this.dom.style.display = 'none'
        }
        document.querySelector("#game").appendChild(this.dom);
        this.show = function () {
            this.dom.style.left = `${this.left}px`
            this.dom.style.top = `${this.top}px`
        }
        this.show();
    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min)
    }
    function shuffle() {
        for (let i = 0; i < blocks.length - 1; i++) {
            const index = getRandom(0, blocks.length - 2);
            exchange(blocks[i], blocks[index])
        }
    }
    /** 交换方块 */
    function exchange(b1, b2) {
        const { left: b1_left, top: b1_top } = b1
        const { left: b2_left, top: b2_top } = b2
        b1.left = b2_left;
        b1.top = b2_top;
        b2.left = b1_left;
        b2.top = b1_top;
        b1.show()
        b2.show()
    }
    function registerEvent() {
        // 不可见的方块
        const inVisibleBlock = blocks.find(item => !item.isVisible)
        blocks.forEach(item => {
            item.dom.onclick = function (e) {
                if (gameConfig.isOver) {
                    return
                }
                // 邻近的item有不可见的才可以交换
                if (item.top === inVisibleBlock.top || item.left === inVisibleBlock.left) {
                    exchange(item, inVisibleBlock)
                    setTimeout(() => {
                        isWin()
                    }, 0)
                }
            }
        })
    }
    function isWin() {
        const isWin = blocks.every(item => item.top === item.correctTop && item.left === item.correctLeft)
        if (isWin) {
            alert('恭喜，闯关成功')
            //游戏结束，去掉所有边框
            blocks.forEach(function (b) {
                b.dom.style.border = "none";
                b.dom.style.display = "block";
            });
        }
    }
})();
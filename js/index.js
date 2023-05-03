'use strict';

//* mmへの変換をいつするか。ダウンロード時にまとめてするという手もあり？
//* SVGへの変換だけをfabric.js機能を使って、描画は純粋なcanvasでできないかな？
//* できないなーcanvasで書いたものはfabric.jsでdlできない。空になっちゃってる

// mmからpixelに変換する関数 --------------------------------------------
// ?dpiが72で良いのかどうかわからない
function mmToPixel(mm) {
  const dpi = 72;
  // mmをインチに
  const inch = mm / 25.4;
  // インチをpixelに(72dpiとして)
  const pixel = inch * dpi;
  return pixel;
}

// inputの入力値を数値にしてpixelにして返す関数 ------------------------------------------------
function inputValueToPixel(id) { //引数にinput要素のid名を受け取る
  const inputValue = document.getElementById(id).value;
  const pixel = mmToPixel(parseInt(inputValue));
  return pixel;
}

// ラジオボタン 選択されたボタンに色をつける
const radios = document.querySelectorAll('.radio-label input');
radios.forEach(radio => {
  radio.addEventListener('click', () => {
    radios.forEach(radio => {
      radio.parentNode.classList.remove('active');
    });
    radio.parentNode.classList.add('active');
  });
});

// タブを切り替える ------------------------------------------------------------------------
// 一つめのworkspaceを表示させておく
document.querySelector('.component:first-child .workspace').classList.add('appear');
// タブ切り替え
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const workspaces = document.querySelectorAll('.workspace');
    workspaces.forEach(workspace => {
      workspace.classList.remove('appear');
    });
    tab.nextElementSibling.classList.add('appear');
  });
});

// fabricインスタンス生成 ------------------------------------------------------------------
const canvas = new fabric.Canvas('my-canvas');
// const canvas = new fabric.StaticCanvas('my-canvas');
const canvasSize = 416;
const canvasHalfWidth = 208;
const canvasHalfHeight = 320;

// 変数を事前に定義しておく -----------------------------------------------------------------
let caseObject;
let openingObject;
let crownObject; //2種類のクラウンで同じ名前共有できるか？できたみたい
let lugObject;
const lugThickness = mmToPixel(2);




// ラグを描く関数 ------------------------------------------

let lugWidth;

const lugs = document.querySelectorAll('input[name="lug-shape"]');
lugs.forEach(lug => {
  lug.addEventListener('click', () => {
    // ラグ幅の入力を受ける
    lugWidth = inputValueToPixel('lug-width');
    switch(lug.value) {
      case 'round':
        drawRoundLug();
        break;
      case 'square':
        drawSquareLug();
        break;
    }
  });
});

// lugを普通に描く関数
// function drawRoundLug() {
//   canvas.remove(lugObject);
//   fabric.loadSVGFromURL('./images/lug-round.svg', (objects, options) => {
//     lugObject = fabric.util.groupSVGElements(objects, options);
//     lugObject.set({
//       originX: 'center',
//       left: canvasHalfWidth,
//       top: canvasHalfHeight - caseObject.height / 2 - lugObject.height / 2
//     });
//     canvas.add(lugObject);
//     lugObject.sendToBack();
//   });
// }

// lugを2個描く --------------------------------------------------------------------
const lugArray = [];
let lugPosition = 0;
function drawRoundLug() {
  lugArray.forEach(lug => {
    canvas.remove(lug);
  });
  for(let i = 0; i < 2; i++) {
    fabric.loadSVGFromURL('./images/lug-round.svg', (objects, options) => {
      lugArray[i] = fabric.util.groupSVGElements(objects, options);
      lugArray[i].set({
        originX: 'center',
        left: canvasHalfWidth - lugWidth / 2 - lugThickness / 2 + lugPosition,
        top: canvasHalfHeight - caseObject.height / 1.7,
      });
      canvas.add(lugArray[i]);
      lugArray[i].sendToBack();
      lugPosition += lugWidth + lugThickness;
    });
  }
  lugPosition = 0;
}
function drawSquareLug() {
  lugArray.forEach(lug => {
    canvas.remove(lug);
  });
  for(let i = 0; i < 2; i++) {
    fabric.loadSVGFromURL('./images/lug-square.svg', (objects, options) => {
      lugArray[i] = fabric.util.groupSVGElements(objects, options);
      lugArray[i].set({
        originX: 'center',
        left: canvasHalfWidth - lugWidth / 2 - lugThickness / 2 + lugPosition,
        top: canvasHalfHeight - caseObject.height / 1.7,
      });
      canvas.add(lugArray[i]);
      lugArray[i].sendToBack();
      lugPosition += lugWidth + lugThickness;
    });
  }
  lugPosition = 0;
}

// strapを描く関数 作成しておいたSVGファイルをcanvasに読み込む --------------------------
function drawStrap() {
  fabric.loadSVGFromURL('./images/strap.svg', (objects, options) =>{
    const strap = fabric.util.groupSVGElements(objects, options);
    strap.set({
      originX: 'center',
      left: canvasHalfWidth,
      // strapを描く位置(高さ)を、ケースの位置から取得する
      top: caseObject.top + caseObject.height / 2 + mmToPixel(1),
      fill: 'green',
    });
    canvas.add(strap);
  });
}

// ケースと見切り inputに入力するとcanvasに描かれる
document.getElementById('case-size').addEventListener('input', () => {
  canvas.remove(caseObject);
  drawCase();
});
document.getElementById('opening-size').addEventListener('input', () => {
  canvas.remove(openingObject);
  drawOpening();
});

// fireボタンクリックイベント ----------------------------------------------------------------
document.getElementById('fire-btn').addEventListener('click', () => {
  drawStrap();
});


// リュウズを描く関数 -----------------------------------------------------------------------
const crowns = document.querySelectorAll('input[name="crown-shape"]');
crowns.forEach(crown => {
  crown.addEventListener('click', () => {
    switch(crown.value) {
      case 'round':
        drawRoundCrown();
        break;
      case 'square':
        drawSquareCrown();
        break;
    }
  });
});
function drawSquareCrown() {
  canvas.remove(crownObject);
  fabric.loadSVGFromURL('./images/crown-square.svg', (objects, options) => {
    crownObject = fabric.util.groupSVGElements(objects, options);
    crownObject.set({
      originY: 'center',
      left: caseObject.left + caseObject.width / 2,
      top: canvasHalfHeight,
    });
    canvas.add(crownObject);
  });
}
function drawRoundCrown() {
  canvas.remove(crownObject);
  fabric.loadSVGFromURL('./images/crown-round.svg', (objects, options) => {
    crownObject = fabric.util.groupSVGElements(objects, options);
    crownObject.set({
      originY: 'center',
      left: caseObject.left + caseObject.width / 2,
      top: canvasHalfHeight,
    });
    canvas.add(crownObject);
  });
}
// ?svgを読み込む関数分けられるかな？

// ケースを描く関数 ---------------
// ?見切りを描く関数とほとんど同じなので、同じ関数にしたいが...
// ?インスタンス名がちがうから？うまくremoveできない
// ?for文とかで繰り返して2つ作る？
function drawCase(){
  const caseSize = inputValueToPixel('case-size');
  caseObject = new fabric.Circle({ 
    originX: 'center',
    originY: 'center',
    left: canvasHalfWidth,
    top: canvasHalfHeight,
    strokeWidth: 1,
    stroke: 'black',
    radius: caseSize / 2,
    fill: 'white',
  });
  canvas.add(caseObject);
}

// ケースにグラデーションを適応
// クラスを使ってみる！！
class Gradation extends fabric.Gradient {
  constructor(options) {
    super(options);
    this.type = 'linear';
    this.gradientUnits = 'percentage';
    this.coords = { x1: 0, y1: 0, x2: 1, y2: 0 };
  }
}
const goldGradation = new Gradation({
  colorStops:[
    { offset: 0, color: 'rgb(238,215,71)'},
    { offset: .5, color: '#fff'},
    { offset: 1, color: 'rgb(238,215,71)'},
  ]
});
const silverGradation = new Gradation({
  colorStops:[
    { offset: 0, color: 'rgb(211,211,211)'},
    { offset: .5, color: 'rgb(247,247,247)'},
    { offset: 1, color: 'rgb(211,211,211)'},
  ]
});
const pinkGoldGradation = new Gradation({
  colorStops:[
    { offset: 0, color: 'rgb(220,170,119)'},
    { offset: .5, color: 'rgb(255,239,230)'},
    { offset: 1, color: 'rgb(220,170,119)'},
  ]
});

// ボタンクリックでケースに色をつける
const caseColors = document.querySelectorAll('input[name="metal-color"]');
caseColors.forEach(caseColor => {
  caseColor.addEventListener('click', () => {
    switch(caseColor.value) {
      case 'gold':
        caseObject.set({
          fill: goldGradation,
        });
        break;
      case 'silver':
        caseObject.set({
          fill: silverGradation,
        });
        break;
      case 'pink-gold':
        caseObject.set({
          fill: pinkGoldGradation,
        });
        break;
    }
    canvas.renderAll();
  });
});
// りゅうずとラグにも同時に色をつけたい


// 見切りを描く関数 ---------------
function drawOpening() {
  const openingSize = inputValueToPixel('opening-size');
  openingObject = new fabric.Circle({
    originX: 'center',
    originY: 'center',
    left: canvasHalfWidth,
    top: canvasHalfHeight,
    strokeWidth: 1,
    stroke: 'black',
    radius: openingSize / 2,
    fill: 'white',
  });
  canvas.add(openingObject);
}



// canvasの内容をSVGに変換してダウンロードする ----------------------------------------------
document.getElementById('dl-btn').addEventListener('click', () => {
  // fabric.jsのtoSVGメソッドを使って、canvasの内容をSVG形式のテキストデータに変換
  const svgData = canvas.toSVG(); 
  // SVGをblobに変換
  const blob = new Blob([svgData], {type: 'image/svg+xml'});
  // aタグを生成して、
  const link = document.createElement('a');
  // ダウンロードリンクのURLを、BlobオブジェクトのURLに設定します。BlobオブジェクトのURLは、URL.createObjectURL()メソッドを使用して作成されます。
  link.href = URL.createObjectURL(blob);
  // ダウンロードするファイルの名前を指定して、
  link.download = 'watch.svg';
  // リンクを自動的にクリックしてダウンロードさせる
  link.click();
  // オブジェクト URL を解放
  URL.revokeObjectURL(link.href);
});

// canvasの(ページの？)座標をconsoleに表示する -----------------------------------------------
const headerHeight = 62;
canvas.on('mouse:down', function(options) {
  console.log(`x座標:${options.e.clientX}`, `y座標:${options.e.clientY - headerHeight}`);
});



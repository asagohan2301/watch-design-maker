'use strict';

//* mmへの変換をいつするか。ダウンロード時にまとめてするという手もあり？
//* SVGへの変換だけをfabric.js機能を使って、描画は純粋なcanvasでできないかな？
//* できないなーcanvasで書いたものはfabric.jsでdlできない。空になっちゃってる


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
const canvasSize = 416;
const canvasHalfWidth = 208;
const canvasHalfHeight = 320;

// 変数を事前に定義しておく
let caseObject;
let openingObject;
let crownObject; //2種類のクラウンで同じ名前共有できるか？できたみたい

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

// inputに入力するとcanvasに描かれる
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
  
  // drawCase();
  // drawOpening();
  drawStrap();
});

// リュウズを描く関数 -------------
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
// svgを読み込む関数分けられるかな？


document.getElementById('crown-square').addEventListener('click', () => {
  drawSquareCrown();
});
document.getElementById('crown-round').addEventListener('click', () => {
  drawRoundCrown();
});

// ケースを描く関数 ---------------
// ?見切りを描く関数とほとんど同じなので、同じ関数にしたいが...
// ?インスタンス名がちがうから？うまくremoveできない
// ?for文とかで繰り返して2つ作る？
function drawCase(){
  const inputCaseSize = document.getElementById('case-size').value;
  const mmCaseSize = parseInt(inputCaseSize);
  const caseSize = mmToPixel(mmCaseSize);
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

// 見切りを描く関数 ---------------
function drawOpening() {
  const inputOpeningSize = document.getElementById('opening-size').value;
  const mmOpeningSize = parseInt(inputOpeningSize);
  const openingSize = mmToPixel(mmOpeningSize);
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

// mmからpixelに変換する関数 --------------------------------------------
// ?dpiが72で良いのかどうかわからない
const dpi = 72;
function mmToPixel(mm) {
  // mmをインチに
  const inch = mm / 25.4;
  // インチをpixelに(72dpiとして)
  const pixel = inch * dpi;
  return pixel;
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



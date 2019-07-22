
var canvas=document.getElementById('canvas');
var cxt=canvas.getContext('2d');
//设置关卡数
var level;
if(window.location.href.split('#')[1]){
    level=window.location.href.split('#')[1];
}else{
    level=0;
}
// document.getElementById('btn').onclick=function(){
//     level++;
//     window.location.href='useqb.html#'+level;
// };
level=level-0;
//保存数据
var levelArray=[
    {"speed":200,"waitNum":5,"rotateNum":3},
    {"speed":180,"waitNum":6,"rotateNum":5},
    {"speed":160,"waitNum":6,"rotateNum":6},
    {"speed":150,"waitNum":8,"rotateNum":8}
];
var smallBallRadius=10;   //等待球半径

var bigX=300;
var bigY=200;
var bigRadius=50;
var lineLength=130;  //转动线的距离
//设置大球
 function big(){
     cxt.save();
     cxt.beginPath();
     cxt.fillStyle='#000';
     cxt.arc(bigX,bigY,bigRadius,0,Math.PI*2,false);
     cxt.closePath();
     cxt.fill();
     cxt.stroke();
     cxt.restore();

     var text=level+1;
     if (level === levelArray.length) {
         text = levelArray.length - 1;
     }
     cxt.textAlign='center';
     cxt.textBaseline='middle';
     cxt.font="60px 宋体";
     cxt.fillStyle='#fff';
     cxt.fillText(text,bigX,bigY);
     cxt.stroke();
 }

 //设置等待球
//保存等待球
var waitBall=[];
 var waitBallLength=levelArray[level].waitNum;   //等待球的数量
for(var i=waitBallLength;i>0;i--){
    waitBall.push({"numStr":i,"deg":""})
}
//保存转动球

var rotateBall=[];
var rotateBallLength=levelArray[level].rotateNum;   //转动球的数量
for(var j=0;j<rotateBallLength;j++){
    var deg=360/rotateBallLength*(j+1);
    rotateBall.push({"deg":deg,"numStr":""});
}

  //绘制等待球
 var waitX=bigX;
 var waitY=260+lineLength;
 function wait(){
     cxt.clearRect(0,350,600,300);
     waitBall.forEach(function(e){
         cxt.save();
         cxt.beginPath();
         cxt.fillStyle='#000';
         cxt.arc(waitX,waitY,smallBallRadius,0,Math.PI*2,false);
         cxt.closePath();
         cxt.fill();
         cxt.stroke();
         cxt.restore();

         cxt.textAlign='center';
         cxt.textBaseline='middle';
         cxt.fillStyle='#fff';
         cxt.font='20px 宋体';
         cxt.fillText(e.numStr,waitX,waitY);
         cxt.stroke();
         waitY+=30;
     });
 }
//绘制转动球
     function drawBall(newDeg){
         rotateBall.forEach(function(item){
              //绘制线
             cxt.save();
             cxt.globalCompositeOperation='destination-over';
             item.deg+=newDeg;
             if(item.deg>=360)item.deg=0;

             cxt.strokeStyle='#000';
             cxt.moveTo(bigX,bigY);
             var rad=Math.PI/180*item.deg;
             var x=bigX+lineLength*Math.cos(rad);
             var y=bigY+lineLength*Math.sin(rad);
             cxt.lineTo(x,y);
             cxt.stroke();
             cxt.restore();

             //绘制线上的球
             cxt.beginPath();
             cxt.fillStyle='#000';
             cxt.arc(x,y,smallBallRadius,0,Math.PI*2,false);
             cxt.closePath();
             cxt.fill();

             if(item.numStr !==''){
                 cxt.fillStyle='#fff';
                 cxt.textAlign='center';
                 cxt.textBaseline='middle';
                 cxt.font='20px 宋体';
                 cxt.fillText(item.numStr,x,y);
                 cxt.stroke();
             }
         })
     }

//初始化
function init(deg){
     cxt.clearRect(0,0,500,600);
    big();
    wait();
    drawBall(deg);
}
init(0);
setInterval(function(){
    cxt.clearRect(0,0,500,350);
    big();
    drawBall(10);
},levelArray[level].speed);

//点击添加
var state;   //保存成功 or 失败
document.onclick=function(){
    if(waitBall.length===0){return;}
    waitY=lineLength+200;
    wait();    //重新绘制等待球

    var ball=waitBall.shift();    //删除等待球的第一个
    console.log(ball);
    ball.deg=90;


    var faild=true;     //成功或失败跳出循环

    rotateBall.forEach(function(item,index){
        console.log(item,index);
        if(!faild)return;
        if(Math.abs(item.deg-ball.deg)/2<360*5/(lineLength*Math.PI)){
            state=0;
             faild=false;
        }else if(index===rotateBall.length-1 && waitBall.length===0){
            state=1;
             faild=false;
        }
    });
    rotateBall.push(ball);      //把删除的添加到转动球中
    waitY=lineLength+240;
    wait();    //重新绘制等待球
    drawBall(0);

    if(state===0){
        alert('闯关失败！');
        window.location.href='index.html#'+level;
    }else if(state===1){
        alert('闯关成功！');
        level++;
        window.location.href='index.html#'+level;
    }

};

let c = document.getElementById('canvas')
let ctx = c.getContext('2d')
let debug = document.getElementById('dbg')
let dotNum = 10000

let biggerDirection
if (window.innerWidth > window.innerHeight) {
  biggerDirection = window.innerHeight
} else {
  biggerDirection = window.innerWidth
}
biggerDirection = 1000
c.width = biggerDirection
c.height = biggerDirection

let size3D = biggerDirection * 0.5; // Radius of the globe
let center3D = -size3D; // Z value of the globe center
let fov = biggerDirection * 0.8;
let center = biggerDirection / 2; // X center of the canvas HTML

let dotList = []
size3D = size3D / 2
for (let i = 0; i < dotNum; i++) {
  let theta = Math.random() * 2 * Math.PI
  let phi = Math.acos((Math.random() * 2) - 1)
  dotList.push({
    x: Math.sin((Math.random() * 2) - 1) * (biggerDirection * 1),
    y: Math.tan((Math.random() * 2) - 1) * (biggerDirection * 1),
    z: ((biggerDirection * 0.7) * Math.cos(phi)) + center3D,
    size: 5,
    colorFunc: (x, y, z) => {return `#${(Math.round(z * 2).toString(16)).repeat(3)}`},
    yFunc: (x, y, z) => {return 0}
  })
}

let frameNum = 0

function draw () {
  ctx.restore();
  ctx.fillStyle = 'rgba(1, 1, 1, 5)'
  ctx.fillRect(0, 0, biggerDirection, biggerDirection)
  ctx.save();
  ctx.translate(biggerDirection / 2, biggerDirection / 2)
  let perfNow = performance.now()
  for (let i of dotList) {

    let cos = Math.sin(frameNum / 100)
    let sin = Math.cos(frameNum / 100)

    let rotX = cos * i.x + sin * (i.z - center3D);
    let rotZ = -sin * i.x + cos * (i.z - center3D) + center3D;
    i.sizeProjection = (fov / (fov - rotZ));
    i.xProject = (rotX * i.sizeProjection);
    i.yProject = (i.y * i.sizeProjection);
    i.drawX = (i.xProject) - (i.sizeProjection / 2)
    i.drawY = i.yProject - (i.sizeProjection / 2)

    i.sizeProjection *= i.size
    // console.log((i.x * sin) - (i.sizeProjection / 2), ' - ', i.y - (i.sizeProjection / 2), ' - ', i.sizeProjection)
    ctx.fillStyle = i.colorFunc(i.xProject,i.yProject,i.sizeProjection)

    ctx.fillRect((i.xProject) - (i.sizeProjection / 2), i.yProject - (i.sizeProjection / 2) + i.yFunc(i.xProject, i.yProject, i.sizeProjection), i.sizeProjection, i.sizeProjection)
  }
  debug.innerHTML = `${Math.round(1000 / (performance.now() - perfNow))}FPS`
  frameNum++
  requestAnimationFrame(draw)
}
draw()

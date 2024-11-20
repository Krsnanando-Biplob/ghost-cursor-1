/*--------------------
Get Mouse
--------------------*/
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, dir: '' };
let clicked = false;

function getMouse(e) {
  const clientX = e.clientX || e.pageX || (e.touches && e.touches[0].pageX) || 0 || window.innerWidth / 2;
  const clientY = e.clientY || e.pageY || (e.touches && e.touches[0].pageY) || 0 || window.innerHeight / 2;

  mouse = {
    x: clientX,
    y: clientY,
    dir: mouse.x > clientX ? 'left' : 'right',
  };
}

['mousemove', 'touchstart', 'touchmove'].forEach(eventType => {
  window.addEventListener(eventType, getMouse);
});

window.addEventListener('mousedown', (e) => {
  e.preventDefault();
  clicked = true;
});

window.addEventListener('mouseup', () => {
  clicked = false;
});

/*--------------------
Ghost Follow
--------------------*/
class GhostFollow {
  constructor(options) {
    Object.assign(this, options);

    this.el = document.querySelector('#ghost');
    this.mouth = document.querySelector('.ghost__mouth');
    this.eyes = document.querySelector('.ghost__eyes');
    this.pos = { x: 0, y: 0 };
  }

  follow() {
    const distX = mouse.x - this.pos.x;
    const distY = mouse.y - this.pos.y;

    const velX = distX / 8;
    const velY = distY / 8;

    this.pos.x += distX / 10;
    this.pos.y += distY / 10;

    const skewX = map(velX, 0, 100, 0, -50);
    const scaleY = map(velY, 0, 100, 1, 2.0);
    const scaleEyeX = map(Math.abs(velX), 0, 100, 1, 1.2);
    const scaleEyeY = map(Math.abs(velX * 2), 0, 100, 1, 0.1);
    let scaleMouth = Math.min(
      Math.max(map(Math.abs(velX * 1.5), 0, 100, 0, 10), map(Math.abs(velY * 1.2), 0, 100, 0, 5)),
      2
    );

    if (clicked) {
      scaleMouth = -scaleMouth;
    }

    this.el.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) scale(0.7) skew(${skewX}deg) rotate(${-skewX}deg) scaleY(${scaleY})`;
    this.eyes.style.transform = `translateX(-50%) scale(${scaleEyeX}, ${clicked ? 0.4 : scaleEyeY})`;
    this.mouth.style.transform = `translate(${(-skewX * 0.5 - 10)}px) scale(${scaleMouth})`;
  }
}

/*--------------------
Map
--------------------*/
function map(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

/*--------------------
Init
--------------------*/
const cursor = new GhostFollow();

/*--------------------
Render
--------------------*/
function render() {
  requestAnimationFrame(render);
  cursor.follow();
}
render();

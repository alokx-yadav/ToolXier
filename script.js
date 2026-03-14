const tools = [
  { href: 'bmi.html', icon: 'fa-calculator', name: 'BMI Calcy' },
  { href: 'todo.html', icon: 'fa-list-check', name: 'Daily To Do' },
  { href: 'age.html', icon: 'fa-calculator', name: 'Age Calcy' },
  { href: 'epicwatch.html', icon: 'fa-clock', name: 'Epic Watch' },
  { href: 'qr.html', icon: 'fa-qrcode', name: 'QR Maker' },
  { href: 'imageresize.html', icon: 'fa-solid fa-image', name: 'Image Resizer' },
  { href: 'gst.html', icon: 'fa-magnifying-glass-dollar', name: 'GST Calcy' },
  { href: 'compress.html', icon: "fa-solid fa-images", name: 'Image Compressor' },
  { href: 'qrdecoder.html', icon: 'fa-qrcode', name: 'QR Decoder' },
  { href: 'tictactoe.html', icon: 'fa-bolt', name: 'XoXo Game' },
  { href: 'link.html', icon: 'fa-bolt', name: 'LinkXier' },
];

const grid = document.querySelector('.links-grid');
const recent = JSON.parse(localStorage.getItem('recentTools')) || [];

const prioritized = [...recent.map(name => tools.find(t => t.name === name)).filter(Boolean)];
const remaining = tools.filter(t => !recent.includes(t.name));
const finalList = [...prioritized, ...remaining];

finalList.forEach(tool => {
  const card = document.createElement('a');
  card.href = tool.href;
  card.className = 'link-card';
  card.innerHTML = `<i class="fa-solid ${tool.icon}"></i><span>${tool.name}</span>`;
  card.addEventListener('click', () => {
    const updated = [tool.name, ...recent.filter(n => n !== tool.name)].slice(0, 3);
    localStorage.setItem('recentTools', JSON.stringify(updated));
  });
  grid.appendChild(card);

});

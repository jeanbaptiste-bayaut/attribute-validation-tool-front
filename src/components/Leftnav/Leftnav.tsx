import './Leftnav.css';

function Leftnav() {
  const hideNav = () => {
    const nav = document.querySelector('nav');
    nav?.classList.remove('open');
  };
  return (
    <nav>
      <div className="close" onClick={hideNav}>
        x
      </div>
      <a href="/">
        <h1>ATTRIBUTE CONTROL TOOL</h1>
      </a>

      <ul>
        <li>
          <a href="/control" onClick={hideNav}>
            Control Values
          </a>
        </li>
        <li>
          <a href="/export" onClick={hideNav}>
            Export
          </a>
        </li>
        <li>
          <a href="/upload" onClick={hideNav}>
            Upload data
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Leftnav;

export function ProbabilityBar({ h, d, a }: { h: number; d: number; a: number }) {
  const p = (x: number) => Math.round(x * 100);
  return (
    <>
      <div className="probbar">
        <i className="h" style={{ width: `${p(h)}%` }} />
        <i className="d" style={{ width: `${p(d)}%` }} />
        <i className="a" style={{ width: `${p(a)}%` }} />
      </div>
      <div className="problab">
        <span>Gana <b>{p(h)}%</b></span>
        <span>Empate <b>{p(d)}%</b></span>
        <span>Gana <b>{p(a)}%</b></span>
      </div>
    </>
  );
}

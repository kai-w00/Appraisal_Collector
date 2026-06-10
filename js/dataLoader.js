async function loadJson(path) {
  const res = await fetch(path);

  if (!res.ok) {
    throw new Error(`${path} 로드 실패`);
  }

  return await res.json();
}

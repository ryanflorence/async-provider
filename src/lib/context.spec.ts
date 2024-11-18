// import assert from "node:assert";
// import { test } from "node:test";

// let c = 0;
// const subject = batch(
//   (ids: string[]): Promise<Array<{ id: string; name: string }>> => {
//     c++;
//     console.log("👉 Batch function called with:", ids);
//     return new Promise(resolve => {
//       setTimeout(
//         () => {
//           resolve(ids.map(id => ({ id, name: `Product ${id}` })));
//         },
//         c === 1 ? 2000 : 1000,
//       );
//     });
//   },
// );

// async function go() {
//   await runBatchContext(async () => {
//     const c = subject("1").then(v => {
//       console.log("up top!", v);
//       return v;
//     });
//     await sleep(100);

//     const b = await Promise.all([
//       subject("1"),
//       subject("2"),
//       subject("2"), // deduped
//       subject("3"),
//     ]);
//     console.log(b);
//     console.log("preloaded", await c);

//     const [d, e] = await Promise.all([subject("1"), subject("5")]);
//     console.log("cached", d);
//     console.log("new", e);
//   });
// }

// function sleep(ms: number) {
//   return new Promise(r => setTimeout(r, ms));
// }

// go().catch(console.error);

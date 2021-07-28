import createMessage from "@/util/createMessage";

export default async (ctx) => {
  console.log(Date.now());
  const data = ctx.body;

  if (Object.prototype.toString.call(data) !== "[Object Object]") {
    ctx.body = createMessage({
      data: data as string,
    });
  } else {
    ctx.body = createMessage(data);
  }
};

const formatAPIResponseMessagetoMessage = (apiMsg: APIResponseMessage): Message => {
  if (apiMsg.agent_role === 'USER')
    return {
      id: new Date().toString(),
      content: apiMsg.message,
      user: { userId: 'user', username: 'mindul', modelImage: null },
      agent: null,
      message_type: apiMsg.agent_role,
      createdAt: new Date(),
      products: apiMsg.products || [],
    };

  return {
    id: new Date().toString(),
    content: apiMsg.message,
    user: null,
    agent: {
      agentType: apiMsg.agent_role!,
      agentname: apiMsg.agent_name!,
    },
    message_type: apiMsg.agent_role,
    createdAt: new Date(),
    products: apiMsg.products || [],
  };
};

const formatAPIRoomIdMessagetoMessage = (apiMsg: APIRoomIdMessage): Message => {
  if (apiMsg.message_type === 'USER')
    return {
      id: new Date().toString(),
      content: apiMsg.content,
      user: { userId: 'user', username: 'mindul', modelImage: null },
      agent: null,
      message_type: apiMsg.message_type,
      createdAt: new Date(apiMsg.created_at),
      products: apiMsg.product_image_url?.map((product) => ({ product_url: product, product_id: '포메터 확인' })) || [],
    };

  return {
    id: new Date().toString(),
    content: apiMsg.content,
    user: null,
    agent: {
      agentType: apiMsg.agent_type!,
      agentname: apiMsg.agent_name!,
    },
    message_type: apiMsg.message_type,
    createdAt: new Date(apiMsg.created_at),
    products: apiMsg.product_image_url?.map((product) => ({ product_url: product, product_id: '포메터 확인' })) || [],
  };
};

export const formatMessage = (apiMsg: APIResponseMessage | APIRoomIdMessage): Message => {
  if ('order' in apiMsg) return formatAPIResponseMessagetoMessage(apiMsg);
  return formatAPIRoomIdMessagetoMessage(apiMsg);
};

export const formatRoomMessage = (apiMsg: APIRoomIdMessage): Message => {
  if (apiMsg.agent_type == null || apiMsg.agent_name == null)
    return {
      id: apiMsg.id.toString(),
      content: apiMsg.content,
      user: {
        userId: 'asdf',
        username: 'mindul',
        modelImage: null,
      },
      agent: null,
      message_type: apiMsg.message_type,
      products: apiMsg.product_image_url
        ? apiMsg.product_image_url.map((url) => ({
            product_url: url,
            product_id: url.slice(15).split('/')[3],
          }))
        : [],
      createdAt: new Date(apiMsg.created_at),
    };

  return {
    id: apiMsg.id.toString(),
    content: apiMsg.content,
    user: null,
    agent: {
      agentType: apiMsg.agent_type,
      agentname: apiMsg.agent_name,
    },
    message_type: apiMsg.message_type,
    products: apiMsg.product_image_url
      ? apiMsg.product_image_url.map((url) => ({
          product_url: url,
          product_id: url.slice(15).split('/')[3],
        }))
      : [],
    createdAt: new Date(apiMsg.created_at),
  };
};

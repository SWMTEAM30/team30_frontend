type UserSettings = {
  theme: 'light' | 'dark';
};

type User = {
  userId: string;
  username: string;
  modelImage: string | null;
};

type Agent = {
  agentType: string;
  agentname: string;
};

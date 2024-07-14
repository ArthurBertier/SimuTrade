export interface Trade {
    stock: string;
    position: string;
    size: number;
    entry: number;
    stop_loss: number;
    price: number;
    pnl: number;
    user_id: string;
  }

export interface UserContextType {
    userId: string | null;
    login: (id: string) => void;
    logout: () => void;
  }
  
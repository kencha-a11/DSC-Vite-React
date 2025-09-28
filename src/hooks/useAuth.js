export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return { user, loading, setUser };
};

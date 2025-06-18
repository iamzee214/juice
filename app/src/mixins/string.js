export default {
  methods: {
    ellipsisWalletName(value) {
      if (value.length > 20) {
        return value.slice(0, 4) + "..." + value.slice(-4);
      }
      return value;
    },
  },
};

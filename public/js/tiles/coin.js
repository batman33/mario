function handle({ entity, match, resolver }) {
  if (entity.player) {
    entity.player.addCoins(1);
    resolver.matrix.delete(match.indexX, match.indexY);
  }
}

export const coin = [handle, handle];

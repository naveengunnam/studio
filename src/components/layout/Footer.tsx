export default function Footer() {
  return (
    <footer className="py-8 mt-auto border-t bg-background">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        <p className="mt-1">Designed with <span role="img" aria-label="heart">❤️</span> by an AI assistant.</p>
      </div>
    </footer>
  );
}

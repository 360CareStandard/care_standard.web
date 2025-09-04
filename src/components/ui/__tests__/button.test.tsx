import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Button } from "../button";
import { axe } from "vitest-axe";
// Tip: if you add data-variant/data-size in <Button />, prefer those over class checks.

describe("<Button />", () => {
  it("renders with default props", async () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(await axe(screen.container)).toHaveNoViolations();
    // Keep or replace with data-variant if you add it:
    expect(button).toHaveClass("bg-primary");
  });

  it("renders different variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button", { name: /secondary/i })).toHaveClass(
      "bg-secondary"
    );

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button", { name: /destructive/i })).toHaveClass(
      "bg-destructive"
    );

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: /outline/i })).toHaveClass(
      "border-input"
    );
  });

  it("renders different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button", { name: /small/i })).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button", { name: /large/i })).toHaveClass("h-11");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled is true", async () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: /disabled/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("disabled:pointer-events-none");
    // disabled should not fire
    const user = userEvent.setup();
    const onClick = vi.fn();
    // re-render with handler:
    // (some button implementations ignore clicks if disabled anyway)
  });

  it("supports keyboard activation (Enter/Space)", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Press</Button>);
    const btn = screen.getByRole("button", { name: /press/i });

    btn.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button", { name: /custom/i })).toHaveClass(
      "custom-class"
    );
  });

  // OPTIONAL — uncomment if your Button forwards refs
  // it("forwards refs", () => {
  //   const ref = { current: null as HTMLButtonElement | null };
  //   render(<Button ref={(el) => (ref.current = el)}>Ref</Button>);
  //   expect(ref.current?.tagName).toBe("BUTTON");
  // });

  // OPTIONAL — uncomment if your Button supports asChild/as polymorphism
  // import { Slot } from "@radix-ui/react-slot";
  // it("renders as a link when using asChild", () => {
  //   render(
  //     <Button asChild>
  //       <a href="/docs">Docs</a>
  //     </Button>
  //   );
  //   const link = screen.getByRole("link", { name: /docs/i });
  //   expect(link).toHaveAttribute("href", "/docs");
  // });
});

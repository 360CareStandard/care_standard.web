import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TopNavigation, Sidebar, NavLink } from "@/components/ui/navigation";
import { Radio, Checkbox, Toggle } from "@/components/ui/form-controls";
import { useState } from "react";
import { DropdownMenuDemo } from "./components/shared/dropdownmenu";

function App() {
  const [tags, setTags] = useState<string[]>(["Design", "Software"]);
  const [toggleChecked, setToggleChecked] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <header className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-balance">Design System</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              A comprehensive design library built with shadcn/ui, Tailwind CSS
              v4, and Plus Jakarta Sans typography
            </p>
          </header>

          {/* Typography Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Typography Scale</h2>
              <p className="text-muted-foreground">
                Harmonious typography scale with font weight variations
              </p>
            </div>
            <DropdownMenuDemo />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-6xl font-bold text-balance">
                    Display Large
                  </h1>
                  <h2 className="text-5xl font-bold text-balance">
                    Display Small
                  </h2>
                  <h3 className="text-4xl font-bold text-balance">
                    Heading H1
                  </h3>
                  <h4 className="text-3xl font-semibold text-balance">
                    Heading H2
                  </h4>
                  <h5 className="text-2xl font-semibold text-balance">
                    Heading H3
                  </h5>
                  <h6 className="text-xl font-semibold text-balance">
                    Heading H4
                  </h6>
                  <p className="text-lg font-medium text-balance">Heading H5</p>
                  <p className="text-base font-medium text-balance">
                    Heading H6
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Large
                    </Badge>
                    <p className="text-lg leading-relaxed text-pretty">
                      Create a design playbook that outlines the department's
                      expectations, best practices.
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Medium
                    </Badge>
                    <p className="text-base leading-relaxed text-pretty">
                      Create a design playbook that outlines the department's
                      expectations, best practices.
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Small
                    </Badge>
                    <p className="text-sm leading-relaxed text-pretty">
                      Create a design playbook that outlines the department's
                      expectations, best practices.
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      XSmall
                    </Badge>
                    <p className="text-xs leading-relaxed text-pretty">
                      Create a design playbook that outlines the department's
                      expectations, best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Button Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Button Components</h2>
              <p className="text-muted-foreground">
                Complete button system with variants, sizes, and states
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Primary Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Semantic Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="destructive">Destructive</Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Success
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Warning
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button className="opacity-75">Loading</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Form Components Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Form Components</h2>
              <p className="text-muted-foreground">
                Input fields, textareas, and form elements with validation
                states
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Input Fields</CardTitle>
                  <CardDescription>
                    Various input types with validation states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="olivia@untitledui.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone number</label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input type="url" placeholder="http://www.untitledui.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email (Error State)
                    </label>
                    <Input type="email" placeholder="olivia@untitledui.com" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Textarea & Tags</CardTitle>
                  <CardDescription>
                    Text areas and tag input components
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Enter a description..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Description (Error)
                    </label>
                    <Textarea placeholder="Enter a description..." />
                  </div>

                  {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <TagInput
                      tags={tags}
                      onTagsChange={setTags}
                      placeholder="Add tags..."
                      helperText="This is a hint text to help user."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (Error)</label>
                    <TagInput
                      tags={["Design", "Software"]}
                      onTagsChange={() => {}}
                      placeholder="Add tags..."
                      error={true}
                      helperText="This is an error message."
                    />
                  </div> */}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Form Layout Example</CardTitle>
                <CardDescription>
                  Complete form with various input types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="olivia@untitledui.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sale amount</label>
                    <Input type="number" placeholder="1,000.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input type="url" placeholder="www.untitledui.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card number</label>
                    <Input type="text" placeholder="Card number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Users</label>
                    <Input type="text" placeholder="Add users" />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Form Controls Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Form Controls</h2>
              <p className="text-muted-foreground">
                Radio buttons, checkboxes, and toggle switches
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Form Control Elements</CardTitle>
                <CardDescription>
                  Interactive form controls with proper states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium">Radio Buttons</h4>
                    <div className="space-y-3">
                      <Radio name="option" label="Option 1" defaultChecked />
                      <Radio name="option" label="Option 2" />
                      <Radio name="option" label="Option 3" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Checkboxes</h4>
                    <div className="space-y-3">
                      <Checkbox label="Checkbox 1" defaultChecked />
                      <Checkbox label="Checkbox 2" defaultChecked />
                      <Checkbox label="Checkbox 3" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Toggle Switch</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Toggle
                          checked={toggleChecked}
                          onCheckedChange={setToggleChecked}
                        />
                        <span className="text-sm">Enable notifications</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Toggle checked={false} />
                        <span className="text-sm">Auto-save</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Color Palette Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Color Palette</h2>
              <p className="text-muted-foreground">
                Comprehensive color system with primary, secondary, and semantic
                colors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                    Primary
                  </CardTitle>
                  <CardDescription>
                    Green palette for main actions and branding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-green-100 rounded-md flex items-center justify-center text-xs font-medium">
                      50
                    </div>
                    <div className="w-full h-12 bg-green-300 rounded-md flex items-center justify-center text-xs font-medium">
                      300
                    </div>
                    <div className="w-full h-12 bg-primary rounded-md flex items-center justify-center text-xs font-medium text-primary-foreground">
                      500
                    </div>
                    <div className="w-full h-12 bg-green-700 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      700
                    </div>
                    <div className="w-full h-12 bg-green-900 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      900
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    Secondary
                  </CardTitle>
                  <CardDescription>
                    Blue palette for supporting elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-blue-100 rounded-md flex items-center justify-center text-xs font-medium">
                      50
                    </div>
                    <div className="w-full h-12 bg-blue-300 rounded-md flex items-center justify-center text-xs font-medium">
                      300
                    </div>
                    <div className="w-full h-12 bg-blue-500 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      500
                    </div>
                    <div className="w-full h-12 bg-blue-700 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      700
                    </div>
                    <div className="w-full h-12 bg-blue-900 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      900
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    Warning
                  </CardTitle>
                  <CardDescription>
                    Orange palette for warnings and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-orange-100 rounded-md flex items-center justify-center text-xs font-medium">
                      50
                    </div>
                    <div className="w-full h-12 bg-orange-300 rounded-md flex items-center justify-center text-xs font-medium">
                      300
                    </div>
                    <div className="w-full h-12 bg-orange-500 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      500
                    </div>
                    <div className="w-full h-12 bg-orange-700 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      700
                    </div>
                    <div className="w-full h-12 bg-orange-900 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      900
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-4 h-4 bg-destructive rounded-full"></div>
                    Error
                  </CardTitle>
                  <CardDescription>
                    Red palette for errors and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-red-100 rounded-md flex items-center justify-center text-xs font-medium">
                      50
                    </div>
                    <div className="w-full h-12 bg-red-300 rounded-md flex items-center justify-center text-xs font-medium">
                      300
                    </div>
                    <div className="w-full h-12 bg-destructive rounded-md flex items-center justify-center text-xs font-medium text-destructive-foreground">
                      500
                    </div>
                    <div className="w-full h-12 bg-red-700 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      700
                    </div>
                    <div className="w-full h-12 bg-red-900 rounded-md flex items-center justify-center text-xs font-medium text-white">
                      900
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Card Components Section */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Card Components</h2>
              <p className="text-muted-foreground">
                Flexible card layouts for content organization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Setup Complete
                  </CardTitle>
                  <CardDescription>
                    Your design library has been successfully converted to a
                    Vite React app.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The color palette, typography scale, and component variants
                    are now available in your Vite React application.
                  </p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Ready to use
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Design Tokens</CardTitle>
                  <CardDescription>
                    CSS custom properties for consistent theming
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Primary</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        hsl(var(--primary))
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Secondary</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        hsl(var(--secondary))
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Error</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        hsl(var(--destructive))
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>
                    Start building your Vite React application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full">Get Started</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Documentation
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Browse Components
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <footer className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground">
              Built with Plus Jakarta Sans, shadcn/ui, and Tailwind CSS • Vite
              React Design System v1.0
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;

"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image,
  Type,
  Hash,
  Plus,
  Trash2,
  MoveVertical,
  Save,
} from "lucide-react";

interface ContentBlock {
  id: string;
  type: "text" | "image" | "hashtags";
  content: string;
}

export default function EditorPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: "block-1", type: "text", content: "" },
  ]);

  const addBlock = (type: ContentBlock["type"]) => {
    setBlocks([
      ...blocks,
      { id: `block-${blocks.length + 1}`, type, content: "" },
    ]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Visual Editor</h1>
          <p className="text-muted-foreground">
            Create and arrange your social media content
          </p>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-700 text-white">
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => addBlock(value as ContentBlock["type"])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Add content block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    Text
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center">
                    <Image className="mr-2 h-4 w-4" />
                    Image
                  </div>
                </SelectItem>
                <SelectItem value="hashtags">
                  <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    Hashtags
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => addBlock("text")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Block
            </Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {blocks.map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative"
                        >
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move"
                                >
                                  <MoveVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Label>{block.type}</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-auto"
                                  onClick={() => removeBlock(block.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {block.type === "text" && (
                                <Input
                                  value={block.content}
                                  onChange={(e) =>
                                    updateBlockContent(block.id, e.target.value)
                                  }
                                  placeholder="Enter your text"
                                />
                              )}
                              {block.type === "image" && (
                                <div className="space-y-4">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      updateBlockContent(
                                        block.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {block.content && (
                                    <div className="aspect-square bg-muted rounded-lg" />
                                  )}
                                </div>
                              )}
                              {block.type === "hashtags" && (
                                <Input
                                  value={block.content}
                                  onChange={(e) =>
                                    updateBlockContent(block.id, e.target.value)
                                  }
                                  placeholder="Enter hashtags (comma-separated)"
                                />
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="text-sm font-medium">Your Hotel Name</div>
                </div>
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div key={block.id}>
                      {block.type === "text" && (
                        <p className="text-sm">{block.content}</p>
                      )}
                      {block.type === "image" && (
                        <div className="aspect-square bg-muted rounded-lg" />
                      )}
                      {block.type === "hashtags" && (
                        <p className="text-sm text-blue-600">
                          {block.content.split(",").map((tag) => `#${tag.trim()} `)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
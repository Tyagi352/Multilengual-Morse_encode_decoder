import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

export function MorseEncoderDashboard() {
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [selectedLang, setSelectedLang] = useState("en")
  const [mode, setMode] = useState("encode")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const endpoint = mode === "encode" ? "/encode" : "/decode"
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, {
        text,
        lang: selectedLang,
      })
      setResult(data.result)
    } catch (err) {
      console.error("Error:", err)
      setResult("Error processing text")
    }
    setLoading(false)
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "gu", name: "Gujarati" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "bn", name: "Bengali" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Morse Code Encoder</h2>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
      <Tabs defaultValue="encode" className="space-y-4">
        <TabsList>
          <TabsTrigger value="encode" onClick={() => setMode("encode")}>
            Encode
          </TabsTrigger>
          <TabsTrigger value="decode" onClick={() => setMode("decode")}>
            Decode
          </TabsTrigger>
        </TabsList>
        <TabsContent value="encode" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Text to Morse</CardTitle>
                <CardDescription>
                  Enter your text in any supported language to convert to Morse code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 rounded-md border"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="input">Input Text</Label>
                  <textarea
                    id="input"
                    className="min-h-[100px] w-full rounded-md border p-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to encode..."
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Converting..." : "Convert to Morse"}
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  Your Morse code will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap">{result}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="decode" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Morse to Text</CardTitle>
                <CardDescription>
                  Enter Morse code to convert back to text.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Output Language</Label>
                  <select
                    id="language"
                    className="w-full p-2 rounded-md border"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="morse">Morse Code</Label>
                  <textarea
                    id="morse"
                    className="min-h-[100px] w-full rounded-md border p-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter Morse code to decode..."
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Converting..." : "Convert to Text"}
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  Your decoded text will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap">{result}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

package site

import "time"

type PageMeta struct {
	Title         string
	Description   string
	Canonical     string
	Image         string
	Type          string
	Schema        string
	PublishedTime string
	ModifiedTime  string
	NoIndex       bool
}

type Feature struct {
	Icon  string
	Title string
	Text  string
}

type Step struct {
	Title string
	Text  string
}

type FAQ struct {
	Question string
	Answer   string
}

type AnalysisReference struct {
	Slug                string
	Category            string
	Subject             string
	Name                string
	Icon                string
	Title               string
	MetaDescription     string
	Lead                string
	Definition          string
	Purpose             string
	Scope               []string
	Process             []string
	Interpretation      string
	Limitations         []string
	RelatedSolutionName string
	RelatedSolutionPath string
	FrequentlyAsked     []FAQ
}

type SolutionKind string

const (
	SolutionKindProduct    SolutionKind = "product"
	SolutionKindCapability SolutionKind = "capability"
	SolutionKindDelivery   SolutionKind = "delivery"
)

type Solution struct {
	Slug            string
	Kind            SolutionKind
	Name            string
	ShortName       string
	Icon            string
	Title           string
	Lead            string
	MetaDescription string
	Summary         string
	Definition      string
	Audience        string
	Challenge       string
	Outcome         string
	HeroDescription string
	HeroSize        string
	SectionTitle    string
	SectionText     string
	ProcessTitle    string
	ProcessText     string
	EvidenceTitle   string
	Features        []Feature
	Steps           []Step
	SecondaryImage  string
	SecondarySize   string
	FrequentlyAsked []FAQ
}

type ArticleSection struct {
	Heading    string
	Paragraphs []string
	Items      []string
}

type Article struct {
	Slug             string
	Category         string
	Title            string
	Description      string
	Summary          string
	Author           string
	PublishedAt      time.Time
	UpdatedAt        time.Time
	ReadingTime      string
	ImageDescription string
	ImageSize        string
	Sections         []ArticleSection
	References       []Reference
}

type Reference struct {
	Label string
	URL   string
}

type ContactForm struct {
	Name     string
	Email    string
	Company  string
	Phone    string
	Message  string
	Interest string
	Website  string
	Consent  bool
}

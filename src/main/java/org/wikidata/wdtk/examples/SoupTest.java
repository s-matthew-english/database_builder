package org.wikidata.wdtk.examples;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.wikidata.wdtk.datamodel.interfaces.EntityDocument;
import org.wikidata.wdtk.datamodel.interfaces.ItemDocument;
import org.wikidata.wdtk.wikibaseapi.WikibaseDataFetcher;

public class SoupTest 
{

	    public static void main(String[] args) throws Exception 
	    {
	    	
	    	BufferedReader br = new BufferedReader(new FileReader("/home/matthias/Workbench/SUTD/nytimes_corpus/NYTimesCorpus/2005/01/01/1638743_output.xml"));
	    	try 
	    	{
	            StringBuilder sb = new StringBuilder();
	            String line = br.readLine();

	            while (line != null) 
	            {
	            	
	                sb.append(line);
	                sb.append(System.lineSeparator());
	                line = br.readLine();
	            }
	            String everything = sb.toString();
	            //System.out.println(everything);
	            Document doc = Jsoup.parse(everything);
	            
	            
	            Elements contents = doc.getElementsByTag("p");


	            int sentence = 0;
		        for (Element content : contents) 
		        {
		        	System.out.println("we're on sentence " + sentence + ".");
		        	//String linkText = content.text();
		        	
		        	Elements pers = content.select("PERSON");
		        	Elements locs = content.select("LOCATION");
		        	Elements orgs = content.select("ORGANIZATION");
		        	
		        	for (Element per : pers)
		        	{
		        		String linkText_per = per.text();
			        	System.out.println("PERSON");
			        	//System.out.println(linkText_per);
			        	//System.out.println();
			        	
			        	String linkText_per_nospace = linkText_per.replace(' ', '+');
			        	//System.out.println(linkText_per_nospace);
			        	
			        	GetQ.getQ(linkText_per_nospace);
			        	
			        	System.out.println();
		
		        	}
		        	
		        	for (Element loc : locs)
		        	{
		        		String linkText_loc = loc.text();
			        	System.out.println("LOCATION");
			        	//System.out.println(linkText_loc);
			        	//System.out.println();
			        	
			        	String linkText_loc_nospace = linkText_loc.replace(' ', '+');
			        	//System.out.println(linkText_loc_nospace);
			        	
			        	GetQ.getQ(linkText_loc_nospace);
			        	
			        	System.out.println();
		        	}
		        	
		        	for (Element org : orgs)
		        	{
		        		String linkText_org = org.text();
			        	System.out.println("ORGANIZATION");
			        	//System.out.println(linkText_org);
			        	//System.out.println();
			        	
			        	String linkText_org_nospace = linkText_org.replace(' ', '+');
			        	//System.out.println(linkText_org_nospace);
			        	
			        	GetQ.getQ(linkText_org_nospace);
			        	
			        	System.out.println();
		        	}

		        	sentence++;
				}


	            
	    	}
	    	finally 
	    	{
	            br.close();
	        }
	    	
	    }
	    
	    

	    
}


	        


